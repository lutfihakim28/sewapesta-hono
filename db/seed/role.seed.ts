import { db } from 'db/index';
import { permissions } from 'db/schema/permissions';
import { roles } from 'db/schema/roles';
import { rolesPermissions } from 'db/schema/rolesPermissions';

export async function seedRoles() {
  console.log('Seeding roles...')
  await db.insert(roles).values({
    name: 'Super Admin',
  })

  const _permissions = await db
    .select({ id: permissions.id })
    .from(permissions)

  await Promise.all(_permissions.map(async (permission) => {
    await db.insert(rolesPermissions).values({
      roleId: 1,
      permissionId: permission.id
    })
  }))
}