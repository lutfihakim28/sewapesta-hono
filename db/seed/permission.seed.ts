import { db } from 'db/index';
import { permissions } from 'db/schema/permissions';

export async function seedPermissions() {
  console.log('Seeding permission...')
  await db.insert(permissions).values([
    { name: 'User' },
    { name: 'Branch' },
    { name: 'Item' },
    { name: 'Owner' },
    { name: 'Order' },
    { name: 'Product' },
    { name: 'Unit' },
    { name: 'Employee' },
  ])
}