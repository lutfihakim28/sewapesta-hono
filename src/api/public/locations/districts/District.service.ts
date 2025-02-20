import { db } from 'db';
import { and, count, eq, like } from 'drizzle-orm';
import { countOffset } from '@/lib/utils/countOffset';
import { District, DistrictFilter } from './District.schema';
import { districts } from 'db/schema/districts';

export class DistrictService {
  static async list(query: DistrictFilter): Promise<District[]> {
    const _districts = await db
      .select({
        code: districts.code,
        name: districts.name,
      })
      .from(districts)
      .where(this.buildWhereClause(query))
      .limit( Number(query.pageSize || 5))
      .offset( countOffset(query.page, query.pageSize))

    return _districts
  }

  static async count(query: DistrictFilter): Promise<number> {
    const item = db
      .select({ count: count() })
      .from(districts)
      .where(this.buildWhereClause(query))
      .get();

    return item?.count || 0;
  }

  private static buildWhereClause(query: DistrictFilter) {
    const conditions: ReturnType<typeof and>[] = [eq(districts.cityCode, query.cityCode)];
    
    if (query.keyword) {
      conditions.push(like(districts.name, `%${query.keyword}%`))
    }
    return and(...conditions)
  }
}