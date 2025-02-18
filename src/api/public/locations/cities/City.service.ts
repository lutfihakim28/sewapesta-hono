import { db } from 'db';
import { and, count, eq, like } from 'drizzle-orm';
import { countOffset } from '@/lib/utils/countOffset';
import { CityFilter } from './City.schema';
import { cities } from 'db/schema/cities';
import { provinces } from 'db/schema/provinces';

export class CityService {
  static async list(query: CityFilter) {
    const _cities = await db
      .select()
      .from(cities)
      .where(and(
        eq(cities.provinceCode, query.provinceCode),
        query.keyword
          ? like(cities.name, `%${query.keyword}%`)
          : undefined
      ))
      .limit( Number(query.pageSize || 5))
      .offset( countOffset(query.page, query.pageSize))

    return _cities
  }

  static async count(query: CityFilter): Promise<number> {
    const item = db
      .select({ count: count() })
      .from(cities)
      .where(and(
        eq(cities.provinceCode, query.provinceCode),
        query.keyword
          ? like(cities.name, `%${query.keyword}%`)
          : undefined
      ))
      .get();

    return item ? item.count : 0;
  }
}