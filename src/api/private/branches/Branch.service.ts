import { and, asc, count, desc, eq, getTableColumns, isNull, like, or, SQL } from 'drizzle-orm';
import { Branch, BranchColumn, BranchExtended, BranchFilter, BranchRequest } from './Branch.schema';
import { branches } from 'db/schema/branches';
import { db } from 'db';
import { countOffset } from '@/lib/utils/countOffset';
import { NotFoundException } from '@/lib/exceptions/NotFoundException';
import { messages } from '@/lib/constants/messages';
import dayjs from 'dayjs';
import { locationQuery } from '@/api/public/locations/Location.query';
import { SortEnum } from '@/lib/enums/SortEnum';
import { SubdistrictService } from '@/api/public/locations/subdistricts/Subdistrict.service';
import { logger } from '@/lib/utils/logger';

const { createdAt, updatedAt, deletedAt, ...columns } = getTableColumns(branches);

export abstract class BranchService {
  static async list(query: BranchFilter): Promise<[BranchExtended[], number]> {
    const { subdistrictCode, ...selectedColumns } = columns

    let sort: SortEnum = SortEnum.Ascending;
    let sortBy: BranchColumn = 'id';

    if (query.sort) {
      sort = query.sort
    }

    if (query.sortBy) {
      sortBy = query.sortBy
    }

    const orderBy = sort === SortEnum.Ascending
      ? asc(branches[sortBy])
      : desc(branches[sortBy])

    const where = this.buildWhereClause(query);

    const result = await Promise.all([
      db.with(locationQuery)
        .select({
          ...selectedColumns,
          location: {
            subdistrict: locationQuery.subdistrict,
            district: locationQuery.district,
            city: locationQuery.city,
            province: locationQuery.province,
          }
        })
        .from(branches)
        .leftJoin(locationQuery, eq(locationQuery.code, branches.subdistrictCode))
        .where(where)
        .orderBy(orderBy)
        .limit(Number(query.pageSize || 5))
        .offset(countOffset(query.page, query.pageSize)),
      this.count(where)
    ])

    return result
  }

  static async get(id: number): Promise<BranchExtended> {
    const { subdistrictCode, ...selectedColumns } = columns
    const branch = db
      .with(locationQuery)
      .select({
        ...selectedColumns,
        location: {
          subdistrict: locationQuery.subdistrict,
          district: locationQuery.district,
          city: locationQuery.city,
          province: locationQuery.province,
        }
      })
      .from(branches)
      .leftJoin(locationQuery, eq(locationQuery.code, branches.subdistrictCode))
      .where(and(
        isNull(branches.deletedAt),
        eq(branches.id, id),
      ))
      .get()

    if (!branch) {
      throw new NotFoundException(messages.errorNotFound('branch'));
    }

    return branch
  }

  static async create(payload: BranchRequest): Promise<Pick<Branch, 'id'>> {
    const { id, ..._ } = columns;

    await SubdistrictService.checkCode(payload.subdistrictCode)

    const [_branch] = await db
      .insert(branches)
      .values(payload)
      .returning({ id })

    logger.debug({
      payload,
      result: _branch,
    }, 'BranchService.create ')

    return _branch
  }

  static async update(_id: number, payload: BranchRequest): Promise<Pick<Branch, 'id'>> {
    const { id, ..._ } = columns;

    await SubdistrictService.checkCode(payload.subdistrictCode)

    const [_branch] = await db
      .update(branches)
      .set(payload)
      .where(and(
        eq(branches.id, _id),
        isNull(branches.deletedAt)
      ))
      .returning({ id })

    logger.debug({
      id: _id,
      payload,
      result: _branch,
    }, 'BranchService.update ')

    return _branch;
  }

  static async delete(id: number): Promise<Branch> {
    const [branch] = await db
      .update(branches)
      .set({
        deletedAt: dayjs().unix(),
      })
      .where(and(
        eq(branches.id, id),
        isNull(branches.deletedAt)
      ))
      .returning(columns)

    logger.debug({
      id,
      result: branch,
    }, 'BranchService.delete ')

    return branch
  }

  private static async count(query?: SQL<unknown>) {
    const item = db
      .select({ count: count() })
      .from(branches)
      .where(query)
      .get()

    return item?.count || 0
  }

  private static buildWhereClause(query: BranchFilter) {
    const conditions: ReturnType<typeof and>[] = [
      isNull(branches.deletedAt),
    ]

    if (query.subdistrictCode) {
      conditions.push(eq(branches.subdistrictCode, query.subdistrictCode))
    } else if (query.districtCode) {
      conditions.push(like(branches.subdistrictCode, `${query.districtCode}%`))
    } else if (query.cityCode) {
      conditions.push(like(branches.subdistrictCode, `${query.cityCode}%`))
    } else if (query.provinceCode) {
      conditions.push(like(branches.subdistrictCode, `${query.provinceCode}%`))
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