import { BadRequestException } from '@/lib/exceptions/BadRequestException';
import { db } from 'db';
import { items } from 'db/schema/items';
import { orderedProducts } from 'db/schema/orderedProducts';
import { productsItems } from 'db/schema/productsItems';
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
      .leftJoin(productsItems, eq(productsItems.itemId, items.id))
      .leftJoin(products, eq(productsItems.productId, products.id))
      .where(inArray(products.id, [1, 6]))

    return _items
  }
}