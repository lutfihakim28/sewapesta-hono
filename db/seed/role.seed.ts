import { db } from 'db/index';
import { permissions } from 'db/schema/permissions';
import { roles } from 'db/schema/roles';
import { rolesPermissions } from 'db/schema/rolesPermissions';
import { AVAILABLE_PERMISSIONS } from './permission.seed';
import { PermissionEnum } from '@/enums/PermissionEnum';
import { inArray } from 'drizzle-orm';
import { RoleEnum } from '@/enums/RoleEnum';

const AVAILABLE_ROLES = [
  {
    name: RoleEnum.SuperAdmin,
    permissions: AVAILABLE_PERMISSIONS
  },
  {
    name: RoleEnum.Admin,
    permissions: [
      PermissionEnum.User,
      PermissionEnum.Branch,
      PermissionEnum.Item,
      PermissionEnum.Order,
      PermissionEnum.Product,
      PermissionEnum.Unit,
    ]
  },
  {
    name: RoleEnum.Employee,
    permissions: [
      PermissionEnum.User,
      PermissionEnum.Branch,
      PermissionEnum.Order,
    ]
  },
  {
    name: RoleEnum.Owner,
    permissions: [
      PermissionEnum.User,
      PermissionEnum.Item,
      PermissionEnum.Order,
      PermissionEnum.Unit,
    ]
  },
  {
    name: RoleEnum.Customer,
    permissions: [
      PermissionEnum.User,
      PermissionEnum.Item,
      PermissionEnum.Order,
      PermissionEnum.Unit,
    ]
  },
  {
    name: RoleEnum.Agent,
    permissions: [
      PermissionEnum.User,
      PermissionEnum.Item,
      PermissionEnum.Order,
      PermissionEnum.Unit,
    ]
  },
]

export async function seedRoles() {
  console.log('Seeding roles...')
  await Promise.all(AVAILABLE_ROLES.map(async (role) => {
    await db.transaction(async (tx) => {
      const [_role] = await tx
        .insert(roles)
        .values({
          name: role.name,
        })
        .returning({ id: roles.id })

      const _permissions = await db
        .select({ id: permissions.id })
        .from(permissions)
        .where(
          inArray(permissions.name, role.permissions)
        )

      await Promise.all(_permissions.map(async (permission) => {
          await tx.insert(rolesPermissions).values({
            roleId: _role.id,
            permissionId: permission.id
          })
        }))
    })

  }))

}