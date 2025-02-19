import { db } from 'db';
import { and, count, eq, like } from 'drizzle-orm';
import { countOffset } from '@/lib/utils/countOffset';
import { subdistricts } from 'db/schema/subdistricts';
import { SubdistrictFilter } from './Subdistrict.schema';
import { Subdistrict } from './Subdistrict.dto';

export class SubdistrictService {
  static async list(query: SubdistrictFilter): Promise<Subdistrict[]> {
    const _subdistricts = await db
      .select()
      .from(subdistricts)
      .where(this.buildWhereClause(query))
      .limit( Number(query.pageSize || 5))
      .offset( countOffset(query.page, query.pageSize))

    return _subdistricts
  }

  static async count(query: SubdistrictFilter): Promise<number> {
    const item = db
      .select({ count: count() })
      .from(subdistricts)
      .where(this.buildWhereClause(query))
      .get();

    return item?.count || 0;
  }

  private static buildWhereClause(query: SubdistrictFilter) {
    const conditions: ReturnType<typeof and>[] = [
      eq(subdistricts.districtCode, query.districtCode)
    ];
        
    if (query.keyword) {
      conditions.push(like(subdistricts.name, `%${query.keyword}%`))
    }
    return and(...conditions)
  }
}