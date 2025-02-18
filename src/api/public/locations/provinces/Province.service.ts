import { db } from 'db';
import { provinces } from 'db/schema/provinces';
import { count, like } from 'drizzle-orm';
import { ProvinceFilter } from './Province.schema';
import { countOffset } from '@/lib/utils/countOffset';

export class ProvinceService {
  static async list(query: ProvinceFilter) {
    const _provinces = await db
      .select()
      .from(provinces)
      .where(query.keyword
        ? like(provinces.name, `%${query.keyword}%`)
        : undefined)
      .limit(Number(query.pageSize || 5))
      .offset(countOffset(query.page, query.pageSize))

    return _provinces
  }

  static async count(query: ProvinceFilter): Promise<number> {
    const item = db
      .select({ count: count() })
      .from(provinces)
      .where(query.keyword
        ? like(provinces.name, `%${query.keyword}%`)
        : undefined)
      .get();

    return item ? item.count : 0;
  }
}