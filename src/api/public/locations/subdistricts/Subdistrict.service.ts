import { db } from 'db';
import { subdistricts } from 'db/schema/subdistricts';
import { Subdistrict } from './Subdistrict.schema';
import { NotFoundException } from '@/utils/exceptions/NotFoundException';
import { eq } from 'drizzle-orm';

export class SubdistrictService {
  static async list(): Promise<Subdistrict[]> {
    const _subdistricts = await db
      .select()
      .from(subdistricts)

    return _subdistricts
  }

  static async checkCode(code: string): Promise<Subdistrict> {
    const [subdistrict] = await db
      .select()
      .from(subdistricts)
      .where(eq(subdistricts.code, code))
      .limit(1)

    if (!subdistrict) {
      throw new NotFoundException('subdistrict')
    }

    return subdistrict
  }
}