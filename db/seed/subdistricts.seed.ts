import { db } from 'db/index';
import { subdistricts } from 'db/schema/subdistricts';
import { SubdistrictData, SubdistrictDto } from 'db/seed/data/subdistrict.dto';

export async function seedSubdistricts() {
  console.log('Seeding subdistricts...')
  const file = Bun.file('db/seed/data/kelurahan.json');
  const data: SubdistrictData[] = await file.json()
  const subdistrictsData = SubdistrictDto.fromArray(data)
  const chunkSize = 5000; // Maximum call stack
  for (let i = 0; i < subdistrictsData.length; i += chunkSize) {
    const chunk = subdistrictsData.slice(i, i + chunkSize);
    await db.insert(subdistricts).values(chunk).onConflictDoNothing()
  }

  return;
}