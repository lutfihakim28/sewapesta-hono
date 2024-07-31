import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { ownersTable } from './owners';
import { relations } from 'drizzle-orm';
import { damagedItemsTable } from './damagedItems';
import { orderedItemsTable } from './orderedItems';
import { unitsTable } from './units';
import { categoriesTable } from './categories';

export const itemsTable = sqliteTable('items', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  quantity: integer('quantity', { mode: 'number' }).notNull().default(1),
  unitId: integer('unit').notNull(),
  categoryId: integer('category_id', { mode: 'number' }).notNull(),
  ownerId: integer('owner_id', { mode: 'number' }).notNull(),
  createdAt: integer('created_at', { mode: 'number' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'number' }),
  deletedAt: integer('deleted_at', { mode: 'number' }),
})

export const itemsRelations = relations(itemsTable, ({ one, many }) => ({
  category: one(categoriesTable, {
    fields: [itemsTable.categoryId],
    references: [categoriesTable.id],
    relationName: 'category.item'
  }),
  owner: one(ownersTable, {
    fields: [itemsTable.ownerId],
    references: [ownersTable.id],
    relationName: 'owner.item',
  }),
  unit: one(unitsTable, {
    fields: [itemsTable.unitId],
    references: [unitsTable.id],
    relationName: 'unit.item',
  }),
  damaged: many(damagedItemsTable, {
    relationName: 'item.damagedItems'
  }),
  ordered: many(orderedItemsTable, {
    relationName: 'item.orderedItems'
  })
}))