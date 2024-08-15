import dayjs from 'dayjs'
import { db } from '..'
import { categories } from '../schema/categories'

export async function seedCategories() {
  console.log('Seeding categories...')
  await db.insert(categories).values([
    {
      name: 'Kain',
      createdAt: dayjs().unix(),
    },
    {
      name: 'Tenda',
      createdAt: dayjs().unix(),
    },
    {
      name: 'Lagan',
      createdAt: dayjs().unix(),
    },
    {
      name: 'Rigging',
      createdAt: dayjs().unix(),
    },
    {
      name: 'Sound',
      createdAt: dayjs().unix(),
    },
    {
      name: 'Lainnya',
      createdAt: dayjs().unix(),
    },
  ])
}