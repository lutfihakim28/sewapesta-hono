import { db } from 'db';
import { ParamId } from '@/schemas/ParamIdSchema';
import { and, eq, isNull, asc, desc, or, like, inArray, count, sql, sum } from 'drizzle-orm';
import dayjs from 'dayjs';
import { items } from 'db/schema/items';
import { ItemCreate, ItemUpdate } from '@/schemas/items/ItemRequestSchema';
import { NotFoundException } from '@/lib/exceptions/NotFoundException';
import { messages } from '@/lib/constants/messages';
import { ItemColumn, ItemFilter } from '@/schemas/items/ItemFilterSchema';
import { countOffset } from '@/lib/utils/countOffset';
import { owners } from 'db/schema/owners';
import { Item } from '@/schemas/items/ItemSchema';
import { ImageService } from './ImageService';
import { products } from 'db/schema/products';
import { productsItems } from 'db/schema/productsItems';
import { ItemProduct } from '@/schemas/items/ItemProductSchema';
import { ItemOrderStat } from '@/schemas/items/ItemOrderStatSchema';
import { orders } from 'db/schema/orders';
import { orderedProducts } from 'db/schema/orderedProducts';
import { ItemOrderStatQuery } from '@/schemas/items/ItemOrderStatQuerySchema';
import { OrderService } from './OrderService';
import { BadRequestException } from '@/lib/exceptions/BadRequestException';
import { ProductItemService } from './ProductItemService';
import { ProductService } from './ProductService';

export abstract class ItemService {
  static async getList(query: ItemFilter): Promise<Array<Item>> {
    let sort: 'asc' | 'desc' = 'asc';
    let sortBy: ItemColumn = 'id';
    let categories: number[] | undefined = undefined;

    if (query.sort) {
      sort = query.sort
    }

    if (query.sortBy) {
      sortBy = query.sortBy
    }

    if (query.categories) {
      categories = query.categories.split('-').map((id) => Number(id));
    }

    const allItems = await db.transaction(async (transaction) => {
      const __items = await transaction.query.items.findMany({
        columns: {
          id: true,
          name: true,
          quantity: true,
        },
        with: {
          owner: {
            columns: {
              id: true,
              name: true,
              phone: true,
              type: true,
            }
          },
          category: {
            columns: {
              id: true,
              name: true,
            },
          },
          unit: {
            columns: {
              id: true,
              name: true,
            }
          },
        },
        where: and(
          isNull(items.deletedAt),
          categories
            ? inArray(
              items.categoryId,
              categories
            )
            : undefined,
          query.keyword
            ? or(
              like(items.name, `%${query.keyword}%`),
              inArray(
                items.ownerId,
                db
                  .select({ id: owners.id })
                  .from(owners)
                  .where(like(owners.name, `%${query.keyword}%`)),
              )
            )
            : undefined,
        ),
        orderBy: sort === 'asc'
          ? asc(items[sortBy])
          : desc(items[sortBy]),
        limit: Number(query.pageSize || 5),
        offset: countOffset(query.page, query.pageSize),
      })

      const _items = await Promise.all(__items.map(async (item) => {
        const images = await ImageService.getByReference({
          reference: 'items',
          referenceId: item.id,
        })

        return {
          ...item,
          images,
        }
      }))

      return _items;
    })

    return allItems;
  }

  static async get(param: ParamId): Promise<Item> {
    const item = await db.transaction(async (transaction) => {
      const _item = await transaction.query.items.findFirst({
        where: and(
          eq(items.id, Number(param.id)),
          isNull(items.deletedAt),
        ),
        columns: {
          id: true,
          name: true,
          quantity: true,
        },
        with: {
          owner: {
            columns: {
              id: true,
              name: true,
              phone: true,
              type: true,
            }
          },
          unit: {
            columns: {
              id: true,
              name: true,

            }
          },
          category: {
            columns: {
              id: true,
              name: true,
            }
          },
        }
      })

      if (!_item) {
        throw new NotFoundException(messages.errorNotFound('barang'))
      }

      const images = await ImageService.getByReference({
        reference: 'items',
        referenceId: _item.id,
      })

      return {
        ..._item,
        images,
      };
    });

    return item;
  }

  static async create(request: ItemCreate): Promise<void> {
    const createdAt = dayjs().unix();
    await db.transaction(async (transaction) => {

      const item = await transaction
        .insert(items)
        .values({
          ...request,
          quantity: Number(request.quantity),
          categoryId: Number(request.categoryId),
          ownerId: Number(request.ownerId),
          unitId: Number(request.unitId),
          createdAt,
        })
        .returning({
          id: items.id,
          name: items.name,
        })

      if (!!request.images) {
        await ImageService.upload({
          reference: 'items',
          referenceId: item[0].id,
          images: request.images,
        })
      }

      if (!!request.price) {
        await ProductService.create({
          name: item[0].name,
          price: request.price,
          overtimeRatio: request.overtimeRatio || 0,
          productItems: [
            {
              itemId: item[0].id,
              price: request.price,
            }
          ],
        })
      }
    })
  }

  static async update(param: ParamId, request: ItemUpdate): Promise<void> {
    const updatedAt = dayjs().unix();
    await db.transaction(async (transaction) => {
      const existingItem = await this.get(param);

      const deletedImages = request.deletedImages
        ? request.deletedImages.split(',')
        : []

      await Promise.all(deletedImages.map((id) => ImageService.delete({ id })))

      const item = await transaction
        .update(items)
        .set({
          ...request,
          quantity: Number(request.quantity),
          categoryId: Number(request.categoryId),
          ownerId: Number(request.ownerId),
          unitId: Number(request.unitId),
          updatedAt,
        })
        .where(and(
          eq(items.id, existingItem.id),
          isNull(items.deletedAt),
        ))
        .returning({
          id: items.id,
        })

      if (!!request.images) {
        await ImageService.upload({
          reference: 'items',
          referenceId: item[0].id,
          images: request.images,
        })
      }

    })
  }

  static async getItemsByProducts(productIds: number[]) {
    const _items = await db
      .select({
        id: items.id,
        productId: products.id,
      })
      .from(items)
      .leftJoin(productsItems, eq(productsItems.itemId, items.id))
      .leftJoin(products, eq(productsItems.productId, products.id))
      .where(inArray(products.id, productIds))

    return _items
  }

  static async delete(param: ParamId) {
    const deletedAt = dayjs().unix();
    const orderCount = await OrderService.countByItem(Number(param.id));
    if (orderCount > 0) {
      throw new BadRequestException(['Barang masih digunakan dalam pesanan aktif.'])
    }
    await db.transaction(async (transaction) => {
      const existingItem = await this.get(param);

      const images = await ImageService.getByReference({
        reference: 'items',
        referenceId: existingItem.id,
      })

      await transaction
        .update(items)
        .set({
          deletedAt,
        })
        .where(and(
          eq(items.id, existingItem.id),
          isNull(items.deletedAt),
        ))

      await Promise.all(images.map((image) => ImageService.delete({ id: image.id.toString() })))
      await ProductItemService.deleteByItem(Number(param.id))
    })
  }

  static async getProductByItem(param: ParamId): Promise<Array<ItemProduct>> {
    const _products = await db
      .select({
        id: products.id,
        name: products.name,
        price: productsItems.price,
      })
      .from(productsItems)
      .leftJoin(items, eq(items.id, productsItems.itemId))
      .leftJoin(products, eq(products.id, productsItems.productId))
      .where(eq(items.id, Number(param.id)))

    return _products
  }

  static async getItemOrderStats(param: ParamId, query: ItemOrderStatQuery): Promise<Array<ItemOrderStat>> {
    const year = query.year || dayjs().format('YYYY');

    const stats = await db
      .select({
        order: count(),
        quantity: sum(orderedProducts.baseQuantity),
        month: sql<string>`strftime('%Y-%m', ${orders.startDate}, 'unixepoch')`,
        monthId: sql<string>`strftime('%m', ${orders.startDate}, 'unixepoch')`,
      })
      .from(orders)
      .leftJoin(orderedProducts, eq(orderedProducts.orderId, orders.id))
      .leftJoin(products, eq(products.id, orderedProducts.productId))
      .leftJoin(productsItems, eq(productsItems.productId, products.id))
      .where(and(
        eq(productsItems.itemId, Number(param.id)),
        eq(sql<string>`strftime('%Y', ${orders.startDate}, 'unixepoch')`, year)
      ))
      .groupBy(sql`strftime('%Y-%m', ${orders.startDate}, 'unixepoch')`)

    return new Array(12).fill(0).map((_, id) => {
      const existingData = stats.find((stat) => Number(stat.monthId) === id + 1);
      const data: ItemOrderStat = {
        month: `${query.year}-${(id + 1).toString().padStart(2, '0')}`,
        order: 0,
        quantity: 0,
      }
      if (existingData) {
        data.month = existingData.month;
        data.order = existingData.order;
        data.quantity = Number(existingData.quantity || 0);
      }

      return data;
    })
  }

  static async count(query: ItemFilter): Promise<number> {
    const item = db
      .select({ count: count() })
      .from(items)
      .where(and(
        isNull(items.deletedAt),
        query.keyword
          ? or(
            like(items.name, `%${query.keyword}%`),
            inArray(
              items.ownerId,
              db
                .select({ id: owners.id })
                .from(owners)
                .where(like(owners.name, `%${query.keyword}%`)),
            )
          )
          : undefined
      ))
      .get();

    return item?.count || 0;
  }
}