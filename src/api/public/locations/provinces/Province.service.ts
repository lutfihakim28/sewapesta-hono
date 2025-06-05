import { db } from 'db';
import { provinces } from 'db/schema/provinces';
import { Province } from './Province.schema';

export class ProvinceService {
  static async list(): Promise<Province[]> {
    const _provinces = await db
      .select()
      .from(provinces)

    return _provinces
  }
}