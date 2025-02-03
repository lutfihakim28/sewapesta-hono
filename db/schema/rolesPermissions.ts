import { permissions } from 'db/schema/permissions';
import { roles } from 'db/schema/roles';
import { relations } from 'drizzle-orm';
import { integer, primaryKey, sqliteTable } from 'drizzle-orm/sqlite-core';

export const rolesPermissions = sqliteTable('roles_permissions', {
  roleId: integer('role_id').references(() => roles.id, { onDelete: 'cascade' }).notNull(),
  permissionId: integer('permission_id').references(() => permissions.id, { onDelete: 'cascade' }).notNull(),
}, (table) => ({
  primaryKey: primaryKey({ columns: [table.roleId, table.permissionId] }),
}))

export const rolesPermissionsRelations = relations(rolesPermissions, ({ one }) => ({
  role: one(roles, {
    fields: [rolesPermissions.roleId],
    references: [roles.id],
  }),
  permission: one(permissions, {
    fields: [rolesPermissions.permissionId],
    references: [permissions.id],
  })
}))