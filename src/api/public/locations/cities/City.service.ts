import { db } from 'db';
import { cities } from 'db/schema/cities';
import { City } from './City.schema';

export class CityService {
  static async list(): Promise<City[]> {
    return db
      .select()
      .from(cities)
  }
}