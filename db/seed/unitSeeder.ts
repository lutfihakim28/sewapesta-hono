import dayjs from 'dayjs'
import { db } from '..'
import { units } from '../schema/units'

export async function seedUnits() {
  console.log('Seeding units...')
  await db.insert(units).values([
    {
      name: 'Pcs',
      createdAt: dayjs().unix(),
    },
    {
      name: 'Meter',
      createdAt: dayjs().unix(),
    },
  ])
}