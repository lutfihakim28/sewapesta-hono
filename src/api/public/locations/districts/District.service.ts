import { db } from 'db';
import { and, count, eq, like } from 'drizzle-orm';
import { countOffset } from '@/lib/utils/countOffset';
import { DistrictFilter } from './District.schema';
import { districts } from 'db/schema/districts';

export class DistrictService {
  static async list(query: DistrictFilter) {
    const _districts = await db
      .select()
      .from(districts)
      .where(and(
        eq(districts.cityCode, query.cityCode),
        query.keyword
          ? like(districts.name, `%${query.keyword}%`)
          : undefined
      ))
      .limit( Number(query.pageSize || 5))
      .offset( countOffset(query.page, query.pageSize))

    return _districts
  }

  static async count(query: DistrictFilter): Promise<number> {
    const item = db
      .select({ count: count() })
      .from(districts)
      .where(and(
        eq(districts.cityCode, query.cityCode),
        query.keyword
          ? like(districts.name, `%${query.keyword}%`)
          : undefined
      ))
      .get();

    return item ? item.count : 0;
  }
}