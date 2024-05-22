import { db } from '..'
import { subCategoriesTable } from '../schema/subCategories'

export async function seedSubCategories() {
  console.log('Seeding subCategories...')
  await db.insert(subCategoriesTable).values([
    {
      name: 'Speaker',
      categoryId: 1,
    },
    {
      name: 'Amplifier',
      categoryId: 1,
    },
    {
      name: 'Tenda',
      categoryId: 2,
    },
    {
      name: 'Lampu',
      categoryId: 2,
    },
    {
      name: 'Blower',
      categoryId: 3,
    },
  ])
}