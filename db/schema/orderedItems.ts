import { relations } from 'drizzle-orm';
import { integer, sqliteTable } from 'drizzle-orm/sqlite-core';
import { itemsTable } from './items';
import { ordersTable } from './orders';

export const orderedItemsTable = sqliteTable('ordered_items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  itemId: integer('item_id').notNull(),
  orderId: integer('order_id').notNull(),
  quantity: integer('quantity').notNull(),
  createdAt: integer('created_at', { mode: 'number' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'number' }),
  deletedAt: integer('deleted_at', { mode: 'number' }),
})

export const orderedItemsRelations = relations(orderedItemsTable, ({ one }) => ({
  item: one(itemsTable, {
    fields: [orderedItemsTable.itemId],
    references: [itemsTable.id],
    relationName: 'item.orderedItems',
  }),
  order: one(ordersTable, {
    fields: [orderedItemsTable.orderId],
    references: [ordersTable.id],
    relationName: 'order.orderedItems',
  })
}));