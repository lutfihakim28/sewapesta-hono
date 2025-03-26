import { countOffset } from '@/lib/utils/count-offset';
import { db } from 'db';
import { districts } from 'db/schema/districts';
import { and, count, eq, like } from 'drizzle-orm';
import { District, DistrictFilter } from './District.schema';

export class DistrictService {
  static async list(query: DistrictFilter): Promise<District[]> {
    return db
      .select({
        code: districts.code,
        name: districts.name,
      })
      .from(districts)
      .where(this.buildWhereClause(query))
      .limit(Number(query.pageSize || 5))
      .offset(countOffset(query.page, query.pageSize))
  }

  static async count(query: DistrictFilter): Promise<number> {
    const [item] = await db
      .select({ count: count() })
      .from(districts)
      .where(this.buildWhereClause(query))

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