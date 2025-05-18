import { integer, primaryKey, pgTable, text, varchar } from 'drizzle-orm/pg-core';
import { users } from './users';
import { RoleEnum } from '@/utils/enums/RoleEnum';

export const usersRoles = pgTable('users_roles', {
  userId: integer('user_id').references(() => users.id).notNull(),
  role: varchar('role', {
    enum: [
      RoleEnum.Admin,
      RoleEnum.Employee,
      RoleEnum.Owner,
      RoleEnum.SuperAdmin,
    ],
    length: 10
  }).notNull(),
}, (table) => ([
  primaryKey({ columns: [table.userId, table.role] })
]))