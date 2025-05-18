import { cities } from 'db/schema/cities';
import { char, index, pgTable, text, varchar } from 'drizzle-orm/pg-core';

export const districts = pgTable('districts', {
  code: char('code', { length: 8 }).primaryKey(),
  name: varchar('name', { length: 50 }).notNull(),
  cityCode: char('city_code', { length: 5 }).references(() => cities.code).notNull()
}, (table) => [index('district_city_index').on(table.cityCode)])