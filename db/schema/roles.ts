import { timestamps } from 'db/schema/timestamps.helper';
import { permissions } from 'db/schema/permissions';
import { rolesPermissions } from 'db/schema/rolesPermissions';
import { users } from 'db/schema/users';
import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const roles = sqliteTable('roles', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').unique().notNull(),
  ...timestamps,
})

export const rolesRelations = relations(roles, ({ many }) => ({
  rolesPermissions: many(rolesPermissions),
  users: many(users)
}))