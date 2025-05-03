import { SortEnum } from '@/lib/enums/SortEnum';
import { and, asc, count, desc, eq, isNotNull, isNull } from 'drizzle-orm';
import { ProductItem, ProductItemExtended, ProductItemFilter, ProductItemRequest } from './ProductItem.schema';
import { ProductItemColumn } from '../items/Item.schema';
import { productsItems } from 'db/schema/products-items';
import { db } from 'db';
import { productItemColumns } from './ProductItem.column';
import { itemColumns } from '../items/Item.column';
import { productColumns } from '../products/Product.column';
import { items } from 'db/schema/items';
import { products } from 'db/schema/products';
import { countOffset } from '@/lib/utils/count-offset';
import { User } from '../users/User.schema';
import { ProductService } from '../products/Product.service';
import { ItemService } from '../items/Item.service';
import { NotFoundException } from '@/lib/exceptions/NotFoundException';
import { messages } from '@/lib/constants/messages';
import { RoleEnum } from '@/lib/enums/RoleEnum';
import { BadRequestException } from '@/lib/exceptions/BadRequestException';

export abstract class ProductItemService {
  static async list(query: ProductItemFilter): Promise<[ProductItemExtended[], number]> {
    let sort: SortEnum = SortEnum.Ascending;
    let sortBy: ProductItemColumn = 'productId';

    if (query.sort) {
      sort = query.sort
    }

    if (query.sortBy) {
      sortBy = query.sortBy
    }

    const orderBy = sort === SortEnum.Ascending
      ? asc(productsItems[sortBy])
      : desc(productsItems[sortBy])

    const conditions: ReturnType<typeof and>[] = [
      isNull(productsItems.deletedAt)
    ]

    if (query.itemId) {
      conditions.push(eq(productsItems.itemId, +query.itemId))
    }
    if (query.productId) {
      conditions.push(eq(productsItems.itemId, +query.productId))
    }

    const [_productsItems, [{ count: _count }]] = await Promise.all([
      db.select({
        ...productItemColumns,
        item: itemColumns,
        product: productColumns,
      })
        .from(productsItems)
        .innerJoin(items, eq(items.id, productsItems.itemId))
        .innerJoin(products, eq(products.id, productsItems.productId))
        .where(and(...conditions))
        .orderBy(orderBy)
        .limit(Number(query.pageSize || 5))
        .offset(countOffset(query.page, query.pageSize)),
      db
        .select({ count: count().mapWith(Number) })
        .from(productsItems)
        .where(and(...conditions))
    ])

    return [_productsItems, _count]
  }

  static async create(payload: ProductItemRequest, user: User): Promise<ProductItemExtended> {
    const product = await ProductService.check(payload.productId, user);
    const item = await ItemService.check(payload.itemId);

    const newProductItem = await db.transaction(async (transaction) => {
      await transaction.delete(productsItems).where(and(
        eq(productsItems.productId, product.id),
        eq(productsItems.itemId, item.id),
        isNotNull(productsItems.deletedAt),
      ))
      const [productItem] = await transaction.insert(productsItems)
        .values(payload)
        .onConflictDoNothing({
          target: [productsItems.itemId, productsItems.productId]
        })
        .returning(productItemColumns)
      return productItem
    })

    if (!newProductItem) {
      throw new BadRequestException(`Product ID ${product.id} and Item ID ${item.id} already paired. Please use update instead if you want to change their pairs properties.`)
    }

    return {
      ...newProductItem,
      product,
      item
    }
  }

  static async update(payload: ProductItemRequest, user: User): Promise<ProductItemExtended> {
    const product = await ProductService.check(payload.productId, user);
    const item = await ItemService.check(payload.itemId);
    const [productItem] = await db
      .update(productsItems)
      .set(payload)
      .where(and(
        eq(productsItems.productId, payload.productId),
        eq(productsItems.itemId, payload.itemId),
        isNull(productsItems.deletedAt)
      ))
      .returning()

    if (!productItem) {
      throw new NotFoundException(messages.errorNotFound(`Product item for product with ID ${payload.productId} and item with ID ${payload.itemId}`));
    }

    return {
      ...productItem,
      product,
      item
    }
  }

  static async delete(itemId: number, productId: number, user: User): Promise<void> {
    const product = await ProductService.check(productId, user)

    await db
      .delete(productsItems)
      .where(and(
        eq(productsItems.productId, productId),
        eq(productsItems.itemId, itemId),
      ))
  }
}