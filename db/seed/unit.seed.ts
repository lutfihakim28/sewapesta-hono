import { db } from '..'
import { units } from '../schema/units'

export async function seedUnits() {
  console.log('Seeding units...')
  await db.insert(units).values([
    {
      name: 'Pcs',
    },
    {
      name: 'Meter',
    },
  ])
}