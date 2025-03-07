import { branches } from 'db/schema/branches';
import { timestamps } from "db/schema/timestamps.helper";
import { profiles } from './profiles';
import { RoleEnum } from '@/lib/enums/RoleEnum';
import { index, int, mysqlTable, varchar } from 'drizzle-orm/mysql-core';

export const users = mysqlTable('users', {
  id: int('id').primaryKey().autoincrement(),
  username: varchar('username', { length: 100 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  branchId: int('branch_id').references(() => branches.id).notNull(),
  role: varchar('role', {
    length: 10,
    enum: [
      RoleEnum.Admin,
      RoleEnum.Agent,
      RoleEnum.Customer,
      RoleEnum.Employee,
      RoleEnum.Owner,
      RoleEnum.SuperAdmin,
    ]
  }).notNull(),
  profileId: int('profile_id').references(() => profiles.id).unique().notNull(),
  refreshToken: varchar('refresh_token', { length: 255 }).unique(),
  ...timestamps,
}, (table) => ([
  index('user_branch_index').on(table.branchId),
  index('user_profile_index').on(table.profileId),
  index('user_role_index').on(table.role),
]))