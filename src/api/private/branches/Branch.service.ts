import { and, count, eq, like, or } from 'drizzle-orm';
import { BranchExtended, BranchFilter } from './Branch.schema';
import { branches } from 'db/schema/branches';
import { db } from 'db';
import { countOffset } from '@/lib/utils/countOffset';

export class BranchService {
  static async list(query: BranchFilter): Promise<BranchExtended[]> {
    const _branches = await db.query.branches.findMany({
      columns: {
        address: true,
        cpName: true,
        cpPhone: true,
        id: true,
        name: true,
      },
      with: {
        subdistrict: {
          columns: {
            code: true,
            name: true,
          },
          with: {
            district: {
              columns: {
                code: true,
                name: true,
              },
              with: {
                city: {
                  columns: {
                    code: true,
                    name: true,
                  },
                  with: {
                    province: {
                      columns: {
                        code: true,
                        name: true,
                      },
                    }
                  },
                }
              },
            }
          },
        }
      },
      where: this.buildWhereClause(query),
      limit: Number(query.pageSize || 5),
      offset: countOffset(query.page, query.pageSize)
    })

    return _branches
  }

  static async count(query: BranchFilter) {
    const item = db
      .select({ count: count() })
      .from(branches)
      .where(this.buildWhereClause(query))
      .get()

    return item?.count || 0
  }

  private static buildWhereClause(query: BranchFilter) {
    const conditions: ReturnType<typeof and>[] = []

    if (query.subdistrictCode) {
      conditions.push(eq(branches.subdistrictCode, query.subdistrictCode))
    }

    if (query.keyword) {
      conditions.push(
        or(
          like(branches.name, `%${query.keyword}%`),
          like(branches.cpName, `%${query.keyword}%`),
          like(branches.cpPhone, `%${query.keyword}%`),
          like(branches.address, `%${query.keyword}%`)
        )
      );
    }

    return and(...conditions)
  }
}