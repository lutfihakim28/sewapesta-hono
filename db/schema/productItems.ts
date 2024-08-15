import { relations } from 'drizzle-orm';
import { integer, real, sqliteTable } from 'drizzle-orm/sqlite-core';
import { items } from './items';
import { products } from './products';

export const productItems = sqliteTable('product_items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  itemId: integer('item_id').notNull(),
  productId: integer('product_id').notNull(),
  price: real('price').notNull(),
  deletedAt: integer('deleted_at', { mode: 'number' }),
})

export const productItemsRelations = relations(productItems, ({ one }) => ({
  item: one(items, {
    fields: [productItems.itemId],
    references: [items.id],
    relationName: 'item.productItems',
  }),
  product: one(products, {
    fields: [productItems.productId],
    references: [products.id],
    relationName: 'product.productItems',
  }),
}))