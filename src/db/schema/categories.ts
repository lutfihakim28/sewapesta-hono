import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { subcategoriesTable } from './subcategories';

export const categoriesTable = sqliteTable('categories', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  createdAt: integer('created_at', { mode: 'number' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'number' }),
  deletedAt: integer('deleted_at', { mode: 'number' }),
})

export const categoriesRelations = relations(categoriesTable, ({ many }) => ({
  subcategories: many(subcategoriesTable, {
    relationName: 'categories.subcategories'
  }),
}))