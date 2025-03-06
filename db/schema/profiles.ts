import { subdistricts } from 'db/schema/subdistricts';
import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { timestamps } from './timestamps.helper';

export const profiles = sqliteTable('profiles', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  phone: text('phone').notNull(),
  address: text('address'),
  subdistrictCode: text('subdistrict_code').references(() => subdistricts.code).notNull(),
  ...timestamps,
}, (table) => ({
  profileSubdistrictCodeIndex: index('profile_subdistrict_code_index').on(table.subdistrictCode),
}))