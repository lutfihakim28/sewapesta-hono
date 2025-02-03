import { db } from 'db/index';
import { provinces } from 'db/schema/provinces';

export async function seedProvinces() {
  console.log('Seeding provinces...')
  const file = Bun.file('db/seed/data/provinsi.json');
  const data = await file.json()
  await db.insert(provinces).values(data)
}