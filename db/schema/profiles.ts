import { subdistricts } from 'db/schema/subdistricts';
import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { timestamps } from './timestamps.helper';
import { users } from './users';

export const profiles = sqliteTable('profiles', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  phone: text('phone').notNull(),
  address: text('address'),
  subdistrictCode: text('subdistrict_code').references(() => subdistricts.code).notNull(),
  userId: integer('user_id').references(() => users.id).unique().notNull(),
  ...timestamps,
}, (table) => ([
  index('profile_subdistrict_index').on(table.subdistrictCode),
  index('user_profile_index').on(table.userId),
]))
