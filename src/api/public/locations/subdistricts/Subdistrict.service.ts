import { db } from 'db';
import { and, count, eq, like } from 'drizzle-orm';
import { countOffset } from '@/lib/utils/count-offset';
import { subdistricts } from 'db/schema/subdistricts';
import { Subdistrict, SubdistrictFilter } from './Subdistrict.schema';
import { BadRequestException } from '@/lib/exceptions/BadRequestException';
import { messages } from '@/lib/constants/messages';

export class SubdistrictService {
  static async list(query: SubdistrictFilter): Promise<Subdistrict[]> {
    const _subdistricts = await db
      .select({
        code: subdistricts.code,
        name: subdistricts.name,
      })
      .from(subdistricts)
      .where(this.buildWhereClause(query))
      .limit(Number(query.pageSize || 5))
      .offset(countOffset(query.page, query.pageSize))

    return _subdistricts
  }

  static async checkCode(code: string): Promise<Subdistrict> {
    const [subdistrict] = await db
      .select({
        code: subdistricts.code,
        name: subdistricts.name,
      })
      .from(subdistricts)
      .where(eq(subdistricts.code, code))
      .limit(1)

    if (!subdistrict) {
      throw new BadRequestException(messages.errorConstraint('subdistrict'))
    }

    return subdistrict
  }

  static async count(query: SubdistrictFilter): Promise<number> {
    const [item] = await db
      .select({ count: count() })
      .from(subdistricts)
      .where(this.buildWhereClause(query))

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