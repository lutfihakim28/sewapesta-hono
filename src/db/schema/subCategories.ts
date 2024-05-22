import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { categoriesTable } from './categories';
import { relations } from 'drizzle-orm';

export const subCategoriesTable = sqliteTable('sub_categories', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  categoryId: integer('category_id', { mode: 'number' }).references(() => categoriesTable.id),
  deletedAt: integer('deleted_at', { mode: 'timestamp' }),
})

export const subCategoriesRelations = relations(subCategoriesTable, ({ one }) => ({
  category: one(categoriesTable, {
    fields: [subCategoriesTable.categoryId],
    references: [categoriesTable.id],
    relationName: 'categories.subCategories',
  })
}))