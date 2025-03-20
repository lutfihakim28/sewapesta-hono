import { branches } from 'db/schema/branches';
import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { timestamps } from "db/schema/timestamps.helper";
import { profiles } from './profiles';
import { RoleEnum } from '@/lib/enums/RoleEnum';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  username: text('username').notNull().unique(),
  password: text('password').notNull(),
  branchId: integer('branch_id').references(() => branches.id).notNull(),
  role: text('role', {
    enum: [
      RoleEnum.Admin,
      RoleEnum.Agent,
      RoleEnum.Customer,
      RoleEnum.Employee,
      RoleEnum.Owner,
      RoleEnum.SuperAdmin,
    ]
  }).notNull(),
  refreshToken: text('refresh_token').unique(),
  ...timestamps,
}, (table) => ([
  index('user_branch_index').on(table.branchId),
  index('user_role_index').on(table.role),
]))
