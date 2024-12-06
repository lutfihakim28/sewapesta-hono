import dayjs from 'dayjs';
import { db } from 'db';
import { productItems } from 'db/schema/productItems';
import { products } from 'db/schema/products';
import { eq, inArray } from 'drizzle-orm';

export abstract class ProductItemService {
  static async deleteByItem(itemId: number) {
    const deletedAt = dayjs().unix();
    await db.transaction(async (transaction) => {
      const deletedProductItem = await transaction
        .update(productItems)
        .set({
          deletedAt,
        })
        .where(eq(productItems.itemId, itemId))
        .returning({
          productId: productItems.productId,
          price: productItems.price,
        })

      const _products = await transaction
        .select({
          id: products.id,
          price: products.price,
        })
        .from(products)
        .where(inArray(products.id, deletedProductItem.map((data) => data.productId)))

      await Promise.all(_products.map(async (product) => {
        const productItemPrice = deletedProductItem.find((data) => data.productId === product.id)?.price || 0;
        const price = product.price - productItemPrice;

        return await transaction
          .update(products)
          .set({
            deletedAt: price <= 0 ? deletedAt : null,
            price,
          })
      }))
    })
  }
}