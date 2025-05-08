import { integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { users } from './users';
import { RoleEnum } from '@/lib/enums/RoleEnum';

export const usersRoles = sqliteTable('users_roles', {
  userId: integer('user_id').references(() => users.id).notNull(),
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
}, (table) => ([
  primaryKey({ columns: [table.userId, table.role] })
]))