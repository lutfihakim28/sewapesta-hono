import { districts } from 'db/schema/districts';
import { char, index, pgTable, text, varchar } from 'drizzle-orm/pg-core';

export const subdistricts = pgTable('subdistricts', {
  code: char('code', { length: 13 }).primaryKey(),
  name: varchar('name', { length: 50 }).notNull(),
  districtCode: char('district_code', { length: 8 }).references(() => districts.code).notNull()
}, (table) => ([index('subdistrict_district_index').on(table.districtCode)]))