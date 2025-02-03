import { db } from 'db/index';
import { districts } from 'db/schema/districts';
import { DistrictData, DistrictDto } from 'db/seed/data/district.dto';

export async function seedDistricts() {
  console.log('Seeding districts...')
  const file = Bun.file('db/seed/data/kecamatan.json');
  const data: DistrictData[] = await file.json()
  const districtsData = DistrictDto.fromArray(data)
  await db.insert(districts).values(districtsData)
}