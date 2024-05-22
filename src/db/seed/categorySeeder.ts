import { db } from '..'
import { categoriesTable } from '../schema/categories'

export async function seedCategories() {
  console.log('Seeding categories...')
  await db.insert(categoriesTable).values([
    {
      name: 'Sound System',
    },
    {
      name: 'Dekorasi',
    },
    {
      name: 'Penunjang',
    },
  ])
}