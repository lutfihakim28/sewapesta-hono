import { db } from 'db';
import { provinces } from 'db/schema/provinces';
import { count, like } from 'drizzle-orm';
import { Province, ProvinceFilter } from './Province.schema';
import { countOffset } from '@/utils/helpers/count-offset';

export class ProvinceService {
  static async list(query: ProvinceFilter): Promise<Province[]> {
    const _provinces = await db
      .select()
      .from(provinces)
      .where(this.buildWhereClause(query))
      .limit(Number(query.pageSize || 5))
      .offset(countOffset(query.page, query.pageSize))

    return _provinces
  }

  static async count(query: ProvinceFilter): Promise<number> {
    const [item] = await db
      .select({ count: count() })
      .from(provinces)
      .where(this.buildWhereClause(query))

    return item?.count || 0;
  }

  private static buildWhereClause(query: ProvinceFilter) {
    return query.keyword
      ? like(provinces.name, `%${query.keyword}%`)
      : undefined
  }
}