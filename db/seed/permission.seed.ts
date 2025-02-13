import { PermissionEnum } from '@/enums/PermissionEnum';
import { db } from 'db/index';
import { permissions } from 'db/schema/permissions';

export const AVAILABLE_PERMISSIONS = [
  PermissionEnum.Branch,
  PermissionEnum.Item,
  PermissionEnum.Order,
  PermissionEnum.Product,
  PermissionEnum.RolePermission,
  PermissionEnum.Unit,
  PermissionEnum.User,
]

export async function seedPermissions() {
  console.log('Seeding permissions...')
  await db.insert(permissions).values(AVAILABLE_PERMISSIONS.map((permission) => ({ name: permission })))
}