import { branches } from 'db/schema/branches';
import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { timestamps } from "db/schema/timestamps.helper";
import { profiles } from './profiles';
import { relations } from 'drizzle-orm';
import { RoleEnum } from '@/enums/RoleEnum';

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
  }),
  profileId: integer('profile_id').references(() => profiles.id).unique().notNull(),
  ...timestamps,
}, (table) => ({
  userBranchIndex: index('user_branch_index').on(table.branchId),
  userProfileIndex: index('user_profile_index').on(table.profileId)
}))

export const usersRelations = relations(users, ({ one }) => ({
  branch: one(branches),
  profile: one(profiles)
}))