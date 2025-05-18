import { subdistricts } from 'db/schema/subdistricts';
import { char, index, integer, numeric, pgTable, serial, text, varchar } from 'drizzle-orm/pg-core';
import { timestamps } from './timestamps.helper';
import { users } from './users';

export const profiles = pgTable('profiles', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  phone: varchar('phone', { length: 15 }).notNull(),
  address: text('address'),
  subdistrictCode: char('subdistrict_code', { length: 13 }).references(() => subdistricts.code).notNull(),
  userId: integer('user_id').references(() => users.id).unique().notNull(),
  ...timestamps,
}, (table) => ([
  index('profile_subdistrict_index').on(table.subdistrictCode),
  index('user_profile_index').on(table.userId),
]))
