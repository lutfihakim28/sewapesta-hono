import { db } from 'db/index';
import { cities } from 'db/schema/cities';
import { CityData, CityDto } from 'db/seed/data/city.dto';

export async function seedCities() {
  console.log('Seeding cities...')
  const file = Bun.file('db/seed/data/kota.json');
  const data: CityData[] = await file.json()
  const citiesData = CityDto.fromArray(data)
  await db.insert(cities).values(citiesData)
}