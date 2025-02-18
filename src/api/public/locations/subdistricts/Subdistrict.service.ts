import { db } from 'db';
import { and, count, eq, like } from 'drizzle-orm';
import { countOffset } from '@/lib/utils/countOffset';
import { subdistricts } from 'db/schema/subdistricts';
import { SubdistrictFilter } from './Subdistrict.schema';

export class SubdistrictService {
  static async list(query: SubdistrictFilter) {
    const _subdistricts = await db
      .select()
      .from(subdistricts)
      .where(and(
        eq(subdistricts.districtCode, query.districtCode),
        query.keyword
          ? like(subdistricts.name, `%${query.keyword}%`)
          : undefined
      ))
      .limit( Number(query.pageSize || 5))
      .offset( countOffset(query.page, query.pageSize))

    return _subdistricts
  }

  static async count(query: SubdistrictFilter): Promise<number> {
    const item = db
      .select({ count: count() })
      .from(subdistricts)
      .where(and(
        eq(subdistricts.districtCode, query.districtCode),
        query.keyword
          ? like(subdistricts.name, `%${query.keyword}%`)
          : undefined
      ))
      .get();

    return item ? item.count : 0;
  }
}