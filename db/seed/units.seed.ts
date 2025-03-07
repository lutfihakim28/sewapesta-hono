import { db } from '..';
import { units } from '../schema/units';

export async function seedUnits() {
  console.log('Seeding units...');
  const _units = await db
    .insert(units)
    .values([
      {
        name: 'Pcs',
      },
      {
        name: 'Meter',
      },
    ])
    .$returningId();

  return _units.map((unit) => unit.id);
}