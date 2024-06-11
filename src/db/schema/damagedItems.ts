import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { itemsTable } from './items';

export const damagedItemsTable = sqliteTable('damaged_items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  itemId: integer('item_id').notNull(),
  quantity: integer('quantity').notNull(),
  description: text('description'),
  createdAt: integer('created_at', { mode: 'number' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'number' }),
  deletedAt: integer('deleted_at', { mode: 'number' }),
})

export const damagedItemsRelations = relations(damagedItemsTable, ({ one }) => ({
  item: one(itemsTable, {
    fields: [damagedItemsTable.itemId],
    references: [itemsTable.id],
    relationName: 'item.damagedItems',
  })
}));