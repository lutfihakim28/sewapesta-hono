import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const imagesTable = sqliteTable('images', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  path: text('path').notNull().unique(),
  url: text('url').notNull().unique(),
  reference: text('reference').notNull(),
  referenceId: integer('reference_id').notNull(),
  createdAt: integer('created_at').notNull(),
})