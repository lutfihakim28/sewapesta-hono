import { districts } from 'db/schema/districts';
import { index, mysqlTable, varchar } from 'drizzle-orm/mysql-core';

export const subdistricts = mysqlTable('subdistricts', {
  code: varchar('code', { length: 13 }).primaryKey(),
  name: varchar('name', { length: 150 }).notNull(),
  districtCode: varchar('district_code', { length: 8 }).references(() => districts.code).notNull()
}, (table) => ([
  index('subdistrict_district_index').on(table.districtCode),
]))