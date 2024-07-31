import { integer, real, sqliteTable } from 'drizzle-orm/sqlite-core';

export const pricesTable = sqliteTable('prices', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  overtimeRatio: real('overtime_ratio'),
  price: real('price').notNull(),
  createdAt: integer('created_at', { mode: 'number' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'number' }),
  deletedAt: integer('deleted_at', { mode: 'number' }),
})