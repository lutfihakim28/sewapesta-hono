import { db } from 'db';
import { districts } from 'db/schema/districts';
import { District, DistrictFilter } from './District.schema';
import { eq } from 'drizzle-orm';

export class DistrictService {
  static async list(query: DistrictFilter): Promise<District[]> {
    return db
      .select()
      .from(districts)
      .where(eq(districts.cityCode, query.cityCode))
  }
}