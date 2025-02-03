import { timestamps } from 'db/schema/timestamps.helper';
import { rolesPermissions } from 'db/schema/rolesPermissions';
import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const permissions = sqliteTable('permissions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').unique().notNull(),
  ...timestamps,
})

export const permissionsRelations = relations(permissions, ({ many }) => ({
  rolesPermissions: many(rolesPermissions)
}))