import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const unitsTable = sqliteTable('units', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  createdAt: integer('created_at', { mode: 'number' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'number' }),
  deletedAt: integer('deleted_at', { mode: 'number' }),
})