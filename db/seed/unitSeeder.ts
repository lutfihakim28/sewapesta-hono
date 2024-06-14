import dayjs from 'dayjs'
import { db } from '..'
import { unitsTable } from '../schema/units'

export async function seedUnits() {
  console.log('Seeding units...')
  await db.insert(unitsTable).values([
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