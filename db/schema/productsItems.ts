import { relations } from 'drizzle-orm';
import { integer, primaryKey, real, sqliteTable } from 'drizzle-orm/sqlite-core';
import { items } from 'db/schema/items';
import { products } from './products';

export const productsItems = sqliteTable('product_items', {
  itemId: integer('item_id'),
  productId: integer('product_id'),
  overtimePrice: integer('overtime_price').default(0), // Exact amount per hour. e.g. 100.000 / hour
  overtimeRatio: real('overtime_ratio').default(0), // Ratio based on total price.
  overtimeMultiplier: real('overtime_multiplier').default(0), // Multiplier from price per hour.
}, (table) => ({
  primaryKey: primaryKey({ columns: [table.itemId, table.productId] })
}))

export const productsItemsRelations = relations(productsItems, ({ one }) => ({
  item: one(items, {
    fields: [ productsItems.itemId],
    references: [ items.id],
  }),
  product: one(products, {
    fields: [ productsItems.productId],
    references: [products.id],
  }),
}))