import { and, count, eq, isNull, like, or } from 'drizzle-orm';
import { Branch, BranchExtended, BranchFilter, BranchRequest } from './Branch.schema';
import { branches } from 'db/schema/branches';
import { db } from 'db';
import { countOffset } from '@/lib/utils/countOffset';
import { NotFoundException } from '@/lib/exceptions/NotFoundException';
import { messages } from '@/lib/constants/messages';
import dayjs from 'dayjs';


const branch = {
  address: branches.address,
  cpName: branches.cpName,
  cpPhone: branches.cpPhone,
  id: branches.id,
  name: branches.name,
  subdistrictCode: branches.subdistrictCode,
}

export abstract class BranchService {
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

  static async get(id: number): Promise<BranchExtended> {
    const branch = await db.query.branches.findFirst({
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
      where: and(
        isNull(branches.deletedAt),
        eq(branches.id, id),
      )
    })

    if (!branch) {
      throw new NotFoundException(messages.errorNotFound('branch'));
    }

    return branch
  }

  static async create(payload: BranchRequest): Promise<Branch> {
    const [_branch] = await db
      .insert(branches)
      .values(payload)
      .returning(branch)

    return _branch
  }

  static async update(id: number, payload: BranchRequest): Promise<Branch> {
    const [_branch] = await db
      .update(branches)
      .set(payload)
      .where(and(
        eq(branches.id, id),
        isNull(branches.deletedAt)
      ))
      .returning(branch)

    return _branch;
  }

  static async delete(id: number): Promise<void> {
    await db
      .update(branches)
      .set({
        deletedAt: dayjs().unix(),
      })
      .where(and(
        eq(branches.id, id),
        isNull(branches.deletedAt)
      ))
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
    const conditions: ReturnType<typeof and>[] = [
      isNull(branches.deletedAt),
    ]

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