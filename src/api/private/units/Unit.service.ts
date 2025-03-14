import { and, count, eq, isNull, like, SQL } from 'drizzle-orm';
import { Unit, UnitFilter, UnitRequest } from './Unit.schema';
import { db } from 'db';
import { countOffset } from '@/lib/utils/countOffset';
import dayjs from 'dayjs';
import { NotFoundException } from '@/lib/exceptions/NotFoundException';
import { messages } from '@/lib/constants/messages';
import { units } from 'db/schema/units';
import { unitColumns } from './Unit.column';

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
    await db
      .insert(units)
      .values(payload)
  }

  static async update(id: number, payload: UnitRequest): Promise<void> {
    await this.check(id)
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

  private static async check(id: number) {
    const [category] = await db
      .select(unitColumns)
      .from(units)
      .where(and(
        eq(units.id, id),
        isNull(units.deletedAt)
      ))

    if (!category) {
      throw new NotFoundException(messages.errorNotFound(`Unit with ID ${id}`))
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