import { branches } from 'db/schema/branches';
import { index, integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';
import {timestamps} from "db/schema/timestamps.helper";

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  username: text('username').notNull().unique(),
  password: text('password').notNull(),
  branchId: integer('branch_id').references(() => branches.id).notNull(),
  roleId: integer('role_id').references(() => branches.id).notNull(),
  ...timestamps,
}, (table) => ({
  userBranchIndex: index('user_branch_index').on(table.branchId),
  userRoleIndex: index('user_role_index').on(table.roleId),
}))