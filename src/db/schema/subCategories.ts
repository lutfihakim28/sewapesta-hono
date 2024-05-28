import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { categoriesTable } from './categories';
import { relations } from 'drizzle-orm';

export const subcategoriesTable = sqliteTable('subcategories', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  categoryId: integer('category_id', { mode: 'number' }).notNull(),
  createdAt: integer('created_at', { mode: 'number' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'number' }),
  deletedAt: integer('deleted_at', { mode: 'number' }),
})

export const subcategoriesRelations = relations(subcategoriesTable, ({ one }) => ({
  category: one(categoriesTable, {
    fields: [subcategoriesTable.categoryId],
    references: [categoriesTable.id],
    relationName: 'categories.subcategories',
  })
}))