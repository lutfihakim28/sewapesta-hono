import { provinces } from 'db/schema/provinces';
import { char, index, pgTable, text, varchar } from 'drizzle-orm/pg-core';

export const cities = pgTable('cities', {
  code: char('code', { length: 5 }).primaryKey(),
  name: varchar('name', { length: 50 }).notNull(),
  provinceCode: char('province_code', { length: 2 }).references(() => provinces.code).notNull()
}, (table) => [index('city_province_index').on(table.provinceCode)])