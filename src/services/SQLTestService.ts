import { BadRequestException } from '@/exceptions/BadRequestException';
import { db } from 'db';
import { items } from 'db/schema/items';
import { orderedProducts } from 'db/schema/orderedProducts';
import { productItems } from 'db/schema/productItems';
import { products } from 'db/schema/products';
import { and, eq, inArray, isNull, sql, sum } from 'drizzle-orm';

export abstract class SQLTestService {
  static async test() {
    const _items = await db
      .select({
        id: items.id,
        productId: products.id,
      })
      .from(items)
      .leftJoin(productItems, eq(productItems.itemId, items.id))
      .leftJoin(products, eq(productItems.productId, products.id))
      .where(inArray(products.id, [1, 6]))

    return _items
  }
}