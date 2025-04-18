import { and, asc, count, desc, eq, isNull, like, or, SQL } from 'drizzle-orm';
import { BranchColumn, BranchExtended, BranchFilter, BranchRequest } from './Branch.schema';
import { branches } from 'db/schema/branches';
import { db } from 'db';
import { countOffset } from '@/lib/utils/count-offset';
import { NotFoundException } from '@/lib/exceptions/NotFoundException';
import { messages } from '@/lib/constants/messages';
import dayjs from 'dayjs';
import { locationQuery } from '@/api/public/locations/Location.query';
import { SortEnum } from '@/lib/enums/SortEnum';
import { logger } from '@/lib/utils/logger';
import { branchColumns } from './Branch.column';
import { BadRequestException } from '@/lib/exceptions/BadRequestException';
import { User } from '../users/User.schema';
import { RoleEnum } from '@/lib/enums/RoleEnum';

export abstract class BranchService {
  static async list(query: BranchFilter): Promise<[BranchExtended[], number]> {
    const { subdistrictCode, ...selectedColumns } = branchColumns

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
            subdistrictCode: locationQuery.subdistrictCode,
            districtCode: locationQuery.districtCode,
            cityCode: locationQuery.cityCode,
            provinceCode: locationQuery.provinceCode,
          }
        })
        .from(branches)
        .leftJoin(locationQuery, eq(locationQuery.subdistrictCode, branches.subdistrictCode))
        .where(where)
        .orderBy(orderBy)
        .limit(Number(query.pageSize || 5))
        .offset(countOffset(query.page, query.pageSize)),
      this.count(where)
    ])

    return result
  }

  static async get(id: number): Promise<BranchExtended> {
    const { subdistrictCode, ...selectedColumns } = branchColumns
    const [branch] = await db
      .with(locationQuery)
      .select({
        ...selectedColumns,
        location: {
          subdistrict: locationQuery.subdistrict,
          district: locationQuery.district,
          city: locationQuery.city,
          province: locationQuery.province,
          subdistrictCode: locationQuery.subdistrictCode,
          districtCode: locationQuery.districtCode,
          cityCode: locationQuery.cityCode,
          provinceCode: locationQuery.provinceCode,
        }
      })
      .from(branches)
      .leftJoin(locationQuery, eq(locationQuery.subdistrictCode, branches.subdistrictCode))
      .where(and(
        isNull(branches.deletedAt),
        eq(branches.id, id),
      ))
      .limit(1)

    if (!branch) {
      throw new NotFoundException(messages.errorNotFound(`Branch with ID ${id}`));
    }

    return branch
  }

  static async create(payload: BranchRequest): Promise<BranchExtended> {
    const { id, ..._ } = branchColumns;

    const [_branch] = await db
      .insert(branches)
      .values(payload)
      .returning({
        id: branches.id
      })

    const newBranch = await this.get(_branch.id)

    logger.debug({
      payload,
      result: newBranch,
    }, 'BranchService.create ')

    return newBranch
  }

  static async update(_id: number, payload: BranchRequest): Promise<BranchExtended> {
    const { id, ..._ } = branchColumns;

    await db
      .update(branches)
      .set(payload)
      .where(and(
        eq(branches.id, _id),
        isNull(branches.deletedAt)
      ))

    const updatedBranch = await this.get(_id)

    logger.debug({
      id: _id,
      payload,
      result: updatedBranch,
    }, 'BranchService.update ')

    return updatedBranch
  }

  static async delete(id: number): Promise<void> {
    const [branch] = await db
      .update(branches)
      .set({
        deletedAt: dayjs().unix(),
      })
      .where(and(
        eq(branches.id, id),
        isNull(branches.deletedAt)
      ))
      .returning()

    if (!branch) {
      throw new NotFoundException(messages.errorNotFound(`Branch with ID ${id}`));
    }

    logger.debug({
      id,
      result: branch,
    }, 'BranchService.delete ')
  }

  static async check(id: number, user: User) {
    if (user.role !== RoleEnum.SuperAdmin && user.branchId !== id) {
      throw new BadRequestException('Requested Branch ID not match with yours.')
    }
    const [branch] = await db
      .select(branchColumns)
      .from(branches)
      .where(and(
        eq(branches.id, id),
        isNull(branches.deletedAt)
      ))
      .limit(1)

    if (!branch) {
      throw new BadRequestException(messages.errorConstraint('Branch'))
    }
  }

  private static async count(query?: SQL<unknown>) {
    const [item] = await db
      .select({ count: count().mapWith(Number) })
      .from(branches)
      .where(query)

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