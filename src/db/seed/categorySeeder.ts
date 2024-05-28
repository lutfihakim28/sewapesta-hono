import dayjs from 'dayjs'
import { db } from '..'
import { categoriesTable } from '../schema/categories'

export async function seedCategories() {
  console.log('Seeding categories...')
  await db.insert(categoriesTable).values([
    {
      name: 'Sound System',
      createdAt: dayjs().unix(),
    },
    {
      name: 'Dekorasi',
      createdAt: dayjs().unix(),
    },
    {
      name: 'Penunjang',
      createdAt: dayjs().unix(),
    },
  ])
}