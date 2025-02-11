import { branches } from 'db/schema/branches';
import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { timestamps } from "db/schema/timestamps.helper";
import { profiles } from './profiles';
import { relations } from 'drizzle-orm';
import { roles } from './roles';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  username: text('username').notNull().unique(),
  password: text('password').notNull(),
  branchId: integer('branch_id').references(() => branches.id).notNull(),
  roleId: integer('role_id').references(() => roles.id).notNull(),
  profileId: integer('profile_id').references(() => profiles.id).unique().notNull(),
  ...timestamps,
}, (table) => ({
  userBranchIndex: index('user_branch_index').on(table.branchId),
  userRoleIndex: index('user_role_index').on(table.roleId),
  userProfileIndex: index('user_profile_index').on(table.profileId)
}))

export const usersRelations = relations(users, ({ one }) => ({
  branch: one(branches),
  role: one(roles),
  profile: one(profiles)
}))