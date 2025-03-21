import { and, count, eq, isNull, like, not, SQL } from 'drizzle-orm';
import { Unit, UnitFilter, UnitRequest } from './Unit.schema';
import { db } from 'db';
import { countOffset } from '@/lib/utils/countOffset';
import dayjs from 'dayjs';
import { NotFoundException } from '@/lib/exceptions/NotFoundException';
import { messages } from '@/lib/constants/messages';
import { units } from 'db/schema/units';
import { unitColumns } from './Unit.column';
import { BadRequestException } from '@/lib/exceptions/BadRequestException';
import { UniqueCheck } from '@/lib/schemas/UniqueCheck.schema';

export abstract class UnitService {
  static async list(query: UnitFilter): Promise<[Unit[], number]> {
    const where = this.buildWhereClause(query);
    const result = await Promise.all([
      db.select(unitColumns)
        .from(units)
        .where(where)
        .limit(Number(query.pageSize || 5))
        .offset(countOffset(query.page, query.pageSize)),
      this.count(where)
    ])

    return result
  }

  static async create(payload: UnitRequest): Promise<void> {
    await this.checkAvailability({ unique: payload.name })
    await db
      .insert(units)
      .values(payload)
  }

  static async update(id: number, payload: UnitRequest): Promise<void> {
    await Promise.all([
      this.check(id),
      this.checkAvailability({ unique: payload.name, id: id.toString() })
    ])
    await db
      .update(units)
      .set(payload)
      .where(and(
        isNull(units.deletedAt),
        eq(units.id, id)
      ))
  }

  static async delete(id: number): Promise<void> {
    await this.check(id)
    await db
      .update(units)
      .set({
        deletedAt: dayjs().unix()
      })
      .where(and(
        isNull(units.deletedAt),
        eq(units.id, id)
      ))
  }

  static async check(id: number) {
    const [category] = await db
      .select(unitColumns)
      .from(units)
      .where(and(
        eq(units.id, id),
        isNull(units.deletedAt)
      ))

    if (!category) {
      throw new NotFoundException(messages.errorConstraint('Unit'))
    }
  }

  static async checkAvailability(query: UniqueCheck) {
    const conditions = [
      isNull(units.deletedAt),
      eq(units.name, query.unique)
    ]

    if (query.id) {
      conditions.push(not(eq(units.id, +query.id)))
    }
    const available = await db
      .select()
      .from(units)
      .where(and(
        ...conditions
      ))

    if (available.length) {
      throw new BadRequestException(messages.uniqueConstraint(`Unit\'s name "${name}"`))
    }
  }

  private static async count(query?: SQL<unknown>) {
    const [item] = await db
      .select({ count: count().mapWith(Number) })
      .from(units)
      .where(query)

    return item?.count || 0
  }

  private static buildWhereClause(query: UnitFilter) {
    const conditions: ReturnType<typeof and>[] = [
      isNull(units.deletedAt),
    ]

    if (query.keyword) {
      conditions.push(
        like(units.name, `%${query.keyword}%`),
      );
    }

    return and(...conditions)
  }
}