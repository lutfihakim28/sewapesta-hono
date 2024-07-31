import { relations } from 'drizzle-orm';
import { integer, sqliteTable } from 'drizzle-orm/sqlite-core';
import { itemsTable } from './items';
import { pricesTable } from './prices';

export const itemPricesTable = sqliteTable('item_prices', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  itemId: integer('item_id').notNull(),
  priceId: integer('price_id').notNull(),
})

export const itemPricesRelations = relations(itemPricesTable, ({ one }) => ({
  item: one(itemsTable, {
    fields: [itemPricesTable.itemId],
    references: [itemsTable.id],
    relationName: 'item.itemPrices',
  }),
  price: one(pricesTable, {
    fields: [itemPricesTable.priceId],
    references: [pricesTable.id],
    relationName: 'price.itemPrices',
  }),
}))