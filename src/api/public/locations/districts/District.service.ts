import { db } from 'db';
import { districts } from 'db/schema/districts';
import { District } from './District.schema';

export class DistrictService {
  static async list(): Promise<District[]> {
    return db
      .select()
      .from(districts)
  }
}