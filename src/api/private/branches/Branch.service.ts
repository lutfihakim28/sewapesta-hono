import { and, asc, count, eq, getTableColumns, isNull, like, or, sql } from 'drizzle-orm';
import { Branch, BranchExtended, BranchFilter, BranchRequest } from './Branch.schema';
import { branches } from 'db/schema/branches';
import { db } from 'db';
import { countOffset } from '@/lib/utils/countOffset';
import { NotFoundException } from '@/lib/exceptions/NotFoundException';
import { messages } from '@/lib/constants/messages';
import dayjs from 'dayjs';
import { locationQuery } from '@/api/public/locations/Location.query';

const { createdAt, updatedAt, deletedAt, ...columns } = getTableColumns(branches);

export abstract class BranchService {
  static async list(query: BranchFilter): Promise<BranchExtended[]> {
    const { subdistrictCode, ...selectedColumns } = columns
    const _branches = await db
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
      .innerJoin(locationQuery, eq(locationQuery.code, branches.subdistrictCode))
      .where(this.buildWhereClause(query))
      .limit(Number(query.pageSize || 5))
      .offset(countOffset(query.page, query.pageSize))

    return _branches
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
      .innerJoin(locationQuery, eq(locationQuery.code, branches.subdistrictCode))
      .where(and(
        isNull(branches.deletedAt),
        eq(branches.id, id),
      ))
      .orderBy(asc(branches.id))
      .get()

    if (!branch) {
      throw new NotFoundException(messages.errorNotFound('branch'));
    }

    return branch
  }

  static async create(payload: BranchRequest): Promise<Branch> {
    const [_branch] = await db
      .insert(branches)
      .values(payload)
      .returning(columns)

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
      .returning(columns)

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

    return branch
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