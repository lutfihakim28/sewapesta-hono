import { provinces } from 'db/schema/provinces';
import { index, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const cities = sqliteTable('cities', {
  code: text('code').primaryKey(),
  name: text('name').notNull(),
  provinceCode: text('province_code').references(() => provinces.code).notNull()
}, () => [cityProvinceIndex])

export const cityProvinceIndex = index('city_province_index').on(cities.provinceCode)