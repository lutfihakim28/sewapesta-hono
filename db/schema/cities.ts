import { provinces } from 'db/schema/provinces';
import { index, mysqlTable, varchar } from 'drizzle-orm/mysql-core';

export const cities = mysqlTable('cities', {
  code: varchar('code', { length: 5 }).primaryKey(),
  name: varchar('name', { length: 150 }).notNull(),
  provinceCode: varchar('province_code', { length: 2 }).references(() => provinces.code).notNull()
}, () => [cityProvinceIndex])

export const cityProvinceIndex = index('city_province_index').on(cities.provinceCode)