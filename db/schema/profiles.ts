import { subdistricts } from 'db/schema/subdistricts';
import { timestamps } from './timestamps.helper';
import { index, int, mysqlTable, varchar } from 'drizzle-orm/mysql-core';
import { users } from './users';

export const profiles = mysqlTable('profiles', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 100 }).notNull(),
  phone: varchar('phone', { length: 15 }).notNull(),
  address: varchar('address', { length: 255 }),
  subdistrictCode: varchar('subdistrict_code', { length: 15 }).references(() => subdistricts.code).notNull(),
  userId: int('user_id').references(() => users.id).unique().notNull(),
  ...timestamps,
}, () => ([
  profileSubdistrictIndex,
  profileUserIndex
]))

export const profileSubdistrictIndex = index('profile_subdistrict_index').on(profiles.subdistrictCode);
export const profileUserIndex = index('user_profile_index').on(profiles.userId);