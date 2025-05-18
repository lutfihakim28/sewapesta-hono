import { char, pgTable, text, varchar } from 'drizzle-orm/pg-core';

export const provinces = pgTable('provinces', {
  code: char('code', { length: 2 }).primaryKey(),
  name: varchar('name', { length: 50 }).notNull(),
})