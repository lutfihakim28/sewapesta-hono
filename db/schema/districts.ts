import { cities } from 'db/schema/cities';
import { index, mysqlTable, varchar } from 'drizzle-orm/mysql-core';

export const districts = mysqlTable('districts', {
  code: varchar('code', { length: 8 }).primaryKey(),
  name: varchar('name', { length: 150 }).notNull(),
  cityCode: varchar('city_code', { length: 5 }).references(() => cities.code).notNull()
}, (table) => [
  index('district_city_code_index').on(table.cityCode)
])