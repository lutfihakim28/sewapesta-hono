import { relations } from 'drizzle-orm';
import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { packageItemsTable } from './packageItems';

export const packagesTable = sqliteTable('prices', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  code: text('code').unique().notNull(),
  overtimeRatio: real('overtime_ratio'),
  price: real('price').notNull().default(0),
  createdAt: integer('created_at', { mode: 'number' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'number' }),
  deletedAt: integer('deleted_at', { mode: 'number' }),
})

export const packagesRelations = relations(packagesTable, ({ many }) => ({
  packageItems: many(packageItemsTable, {
    relationName: 'package.packageItems'
  })
}))