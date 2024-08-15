import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { owners } from './owners';
import { relations } from 'drizzle-orm';
import { units } from './units';
import { categories } from './categories';
import { stockMutations } from './stockMutations';
import { productItems } from './productItems';

export const items = sqliteTable('items', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  quantity: integer('quantity', { mode: 'number' }).notNull().default(1),
  unitId: integer('unit').notNull(),
  categoryId: integer('category_id', { mode: 'number' }),
  ownerId: integer('owner_id', { mode: 'number' }).notNull(),
  createdAt: integer('created_at', { mode: 'number' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'number' }),
  deletedAt: integer('deleted_at', { mode: 'number' }),
})

export const itemsRelations = relations(items, ({ one, many }) => ({
  category: one(categories, {
    fields: [items.categoryId],
    references: [categories.id],
    relationName: 'category.item'
  }),
  owner: one(owners, {
    fields: [items.ownerId],
    references: [owners.id],
    relationName: 'owner.item',
  }),
  unit: one(units, {
    fields: [items.unitId],
    references: [units.id],
    relationName: 'unit.item',
  }),
  stockMutations: many(stockMutations, {
    relationName: 'item.stockMutations'
  }),
  productItems: many(productItems, {
    relationName: 'item.productItems'
  }),
}))