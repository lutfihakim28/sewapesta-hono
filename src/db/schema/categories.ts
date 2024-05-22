import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { subCategoriesTable } from './subCategories';

export const categoriesTable = sqliteTable('categories', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  deletedAt: integer('deleted_at', { mode: 'timestamp' }),
})

export const categoriesRelations = relations(categoriesTable, ({ many }) => ({
  subCategories: many(subCategoriesTable, {
    relationName: 'categories.subCategories'
  }),
}))