import { integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { users } from './users';
import { RoleEnum } from '@/utils/enums/RoleEnum';

export const usersRoles = sqliteTable('users_roles', {
  userId: integer('user_id').references(() => users.id).notNull(),
  role: text('role', {
    enum: [
      RoleEnum.Admin,
      RoleEnum.Employee,
      RoleEnum.Owner,
      RoleEnum.SuperAdmin,
    ]
  }).notNull(),
}, (table) => ([
  primaryKey({ columns: [table.userId, table.role] })
]))