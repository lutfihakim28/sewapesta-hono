import { subdistricts } from 'db/schema/subdistricts';
import { timestamps } from './timestamps.helper';
import { index, int, mysqlTable, varchar } from 'drizzle-orm/mysql-core';

export const profiles = mysqlTable('profiles', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 100 }).notNull(),
  phone: varchar('phone', { length: 15 }).notNull(),
  address: varchar('address', { length: 255 }),
  subdistrictCode: varchar('subdistrict_code', { length: 15 }).references(() => subdistricts.code).notNull(),
  ...timestamps,
}, () => ([profileSubdistrictIndex]))

export const profileSubdistrictIndex = index('profile_subdistrict_index').on(profiles.subdistrictCode);