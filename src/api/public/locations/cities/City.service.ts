import { countOffset } from '@/lib/utils/count-offset';
import { db } from 'db';
import { cities } from 'db/schema/cities';
import { and, count, eq, like } from 'drizzle-orm';
import { City, CityFilter } from './City.schema';

export class CityService {
  static async list(query: CityFilter): Promise<City[]> {
    return db
      .select({
        code: cities.code,
        name: cities.name,
      })
      .from(cities)
      .where(this.buildWhereClause(query))
      .limit(Number(query.pageSize || 5))
      .offset(countOffset(query.page, query.pageSize))
  }

  static async count(query: CityFilter): Promise<number> {
    const [item] = await db
      .select({ count: count() })
      .from(cities)
      .where(this.buildWhereClause(query))

    return item?.count || 0;
  }

  private static buildWhereClause(query: CityFilter) {
    const conditions: ReturnType<typeof and>[] = [eq(cities.provinceCode, query.provinceCode)];

    if (query.keyword) {
      conditions.push(like(cities.name, `%${query.keyword}%`))
    }
    return and(...conditions)
  }
}