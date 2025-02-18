import { MESSAGES } from '@/lib/constants/MESSAGES';
import { BadRequestException } from '@/lib/exceptions/BadRequestException';
import { NotFoundException } from '@/lib/exceptions/NotFoundException';
import { ProductCreate } from '@/schemas/products/ProductCreateSchema';
import { PackageColumn, ProductFilter } from '@/schemas/products/ProductFilterSchema';
import { Product } from '@/schemas/products/ProductSchema';
import { ProductUpdate } from '@/schemas/products/ProductUpdateSchema';
import { ParamId } from '@/schemas/ParamIdSchema';
import { countOffset } from '@/lib/utils/countOffset';
import dayjs from 'dayjs';
import { db } from 'db';
import { items } from 'db/schema/items';
import { productsItems } from 'db/schema/productsItems';
import { products } from 'db/schema/products';
import { and, asc, count, desc, eq, inArray, isNull, like, or } from 'drizzle-orm';

export abstract class ProductService {
  static async getList(query: ProductFilter): Promise<Array<Product>> {
    let sort: 'asc' | 'desc' = 'asc';
    let sortBy: PackageColumn = 'id';

    if (query.sort) {
      sort = query.sort
    }

    if (query.sortBy) {
      sortBy = query.sortBy
    }

    const _products = await db.transaction(async (transaction) => {
      const __products = await transaction.query.products.findMany({
        columns: {
          id: true,
          name: true,
          price: true,
          overtimeRatio: true,
          createdAt: true,
          updatedAt: true,
        },
        where: and(
          isNull(products.deletedAt),
          query.keyword
            ? or(
              like(products.name, `%${query.keyword}%`),
              inArray(
                products.id,
                db
                  .select({ productId: productsItems.productId })
                  .from(productsItems)
                  .where(
                    inArray(
                      productsItems.itemId,
                      db
                        .select({ id: items.id })
                        .from(items)
                        .where(like(items.name, `%${query.keyword}%`)),
                    )
                  ),
              )
            )
            : undefined,
        ),
        orderBy: sort === 'asc'
          ? asc(products[sortBy])
          : desc(products[sortBy]),
        limit: Number(query.pageSize || 5),
        offset: countOffset(query.page, query.pageSize),
      });

      return __products
    })

    return _products;
  }

  static async get(param: ParamId): Promise<Product> {
    const product = await db.transaction(async (transaction) => {
      const product = await transaction.query.products.findFirst({
        where: and(
          eq(products.id, Number(param.id)),
          isNull(products.deletedAt)
        ),
        columns: {
          createdAt: true,
          id: true,
          name: true,
          overtimeRatio: true,
          price: true,
          updatedAt: true,
        },
        with: {
          productItems: {
            columns: {
              id: true,
              price: true,
            },
            with: {
              item: {
                columns: {
                  id: true,
                  name: true,
                }
              }
            }
          }
        }
      })

      if (!product) {
        throw new NotFoundException(MESSAGES.errorNotFound('produk'))
      }

      return product;
    })

    return product;
  }

  static async create(request: ProductCreate): Promise<void> {
    const createdAt = dayjs().unix();
    await db.transaction(async (transaction) => {
      const itemIds = request.productItems.map((data) => data.itemId);
      await this.checkPackageAvailability(itemIds);
      const product = await transaction
        .insert(products)
        .values({
          ...request,
          createdAt,
        })
        .returning({
          id: products.id,
        })

      const productItemsValue = request.productItems.map((items) => {
        return {
          ...items,
          productId: product[0].id,
        }
      })

      await transaction
        .insert(productsItems)
        .values(productItemsValue)
    })
  }

  static async update(param: ParamId, request: ProductUpdate): Promise<void> {
    const updatedAt = dayjs().unix();
    await db.transaction(async (transaction) => {
      const existingPackage = await this.get(param);
      const itemIds = request.productItems.map((data) => data.itemId);
      await this.checkPackageAvailability(itemIds);
      await transaction
        .update(products)
        .set({
          ...request,
          updatedAt,
        })
        .where(and(
          eq(products.id, existingPackage.id),
          isNull(products.deletedAt),
        ))

      await transaction
        .delete(productsItems)
        .where(eq(productsItems.productId, existingPackage.id))

      const productItemsValue = request.productItems.map((items) => {
        return {
          ...items,
          productId: existingPackage.id,
        }
      })

      await transaction
        .insert(productsItems)
        .values(productItemsValue)
    })
  }

  static async delete(param: ParamId) {
    const deletedAt = dayjs().unix();
    await db.transaction(async (transaction) => {
      const existingPackage = await this.get(param);

      await transaction
        .update(products)
        .set({
          deletedAt,
        })
        .where(and(
          eq(products.id, existingPackage.id),
          isNull(products.deletedAt),
        ))

      await transaction
        .update(productsItems)
        .set({
          deletedAt,
        })
        .where(and(
          eq(productsItems.productId, existingPackage.id),
          isNull(productsItems.deletedAt),
        ))
    })
  }

  static async count(query: ProductFilter): Promise<number> {
    const item = db
      .select({ count: count() })
      .from(products)
      .where(and(
        isNull(products.deletedAt),
        query.keyword
          ? or(
            like(products.name, `%${query.keyword}%`),
            inArray(
              products.id,
              db
                .select({ productId: productsItems.productId })
                .from(productsItems)
                .where(
                  inArray(
                    productsItems.itemId,
                    db
                      .select({ id: items.id })
                      .from(items)
                      .where(like(items.name, `%${query.keyword}%`)),
                  )
                ),
            )
          )
          : undefined,
      ))
      .get();

    return item ? item.count : 0;
  }

  static async checkPackageAvailability(itemIds: Array<number>) {
    const _products = await db
      .select()
      .from(products)
      .leftJoin(productsItems, eq(productsItems.productId, products.id))
      .leftJoin(items, eq(items.id, productsItems.itemId))
      .where(and(
        inArray(items.id, itemIds),
        isNull(products.deletedAt),
      ))
      .groupBy(products.id)
      .having(eq(count(productsItems.itemId), itemIds.length));

    if (_products.length > 0) {
      const existingPackageName = _products[0].products.name;
      throw new BadRequestException([`Barang yang dipilih sudah memiliki produk dengan nama ${existingPackageName}.`])
    }
    return true
  }
}