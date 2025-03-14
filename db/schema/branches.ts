import { subdistricts } from 'db/schema/subdistricts';
import { timestamps } from "db/schema/timestamps.helper";
import { index, int, mysqlTable, varchar } from 'drizzle-orm/mysql-core';

export const branches = mysqlTable('branches', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 150 }).notNull(),
  cpName: varchar('cp_name', { length: 100 }).notNull(),
  cpPhone: varchar('cp_phone', { length: 15 }).notNull(),
  address: varchar('address', { length: 255 }).notNull(),
  subdistrictCode: varchar('subdistrict_code', { length: 13 }).references(() => subdistricts.code).notNull(),
  ...timestamps,
}, () => [branchSubdistrictIndex])

export const branchSubdistrictIndex = index('branch_subdistrict_index').on(branches.subdistrictCode)