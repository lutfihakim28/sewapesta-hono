import { branches } from 'db/schema/branches';
import { districts } from 'db/schema/districts';
import { relations } from 'drizzle-orm';
import { index, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const subdistricts = sqliteTable('subdistricts', {
  code: text('code').primaryKey(),
  name: text('name').notNull(),
  districtCode: text('district_code').references(() => districts.code).notNull()
}, (table) => ({
  subdistrictDistrictIndex: index('subdistrict_district_index').on(table.districtCode),
}))