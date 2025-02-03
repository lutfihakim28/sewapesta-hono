import { cities } from 'db/schema/cities';
import { relations } from 'drizzle-orm';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const provinces = sqliteTable('provinces', {
  code: text('code').primaryKey(),
  name: text('name').notNull(),
})

export const provincesRelations = relations(provinces, ({ many }) => ({
  cities: many(cities)
}))