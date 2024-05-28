import dayjs from 'dayjs'
import { db } from '..'
import { subcategoriesTable } from '../schema/subcategories'

export async function seedSubcategories() {
  console.log('Seeding subcategories...')
  await db.insert(subcategoriesTable).values([
    {
      name: 'Speaker',
      categoryId: 1,
      createdAt: dayjs().unix(),
    },
    {
      name: 'Amplifier',
      categoryId: 1,
      createdAt: dayjs().unix(),
    },
    {
      name: 'Tenda',
      categoryId: 2,
      createdAt: dayjs().unix(),
    },
    {
      name: 'Lampu',
      categoryId: 2,
      createdAt: dayjs().unix(),
    },
    {
      name: 'Blower',
      categoryId: 3,
      createdAt: dayjs().unix(),
    },
  ])
}