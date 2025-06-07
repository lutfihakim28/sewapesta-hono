import { db } from 'db';
import { cities } from 'db/schema/cities';
import { City, CityFilter } from './City.schema';
import { eq } from 'drizzle-orm';

export class CityService {
  static async list(query: CityFilter): Promise<City[]> {
    return db
      .select()
      .from(cities)
      .where(eq(cities.provinceCode, query.provinceCode))
  }
}