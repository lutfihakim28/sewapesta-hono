import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const provinces = sqliteTable('provinces', {
  code: text('code').primaryKey(),
  name: text('name').notNull(),
})