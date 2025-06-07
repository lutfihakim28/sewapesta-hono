import { UniqueCheck } from '@/utils/schemas/UniqueCheck.schema';
import { countOffset } from '@/utils/helpers/count-offset';
import { db } from 'db';
import { units } from 'db/schema/units';
import { and, count, desc, eq, isNull, like, not, SQL } from 'drizzle-orm';
import { unitColumns } from './Unit.column';
import { Unit, UnitFilter, UnitRequest } from './Unit.schema';
import { AppDate } from '@/utils/libs/AppDate';
import { ConstraintException } from '@/utils/exceptions/ConstraintException';

export class UnitService {
  static async list(query: UnitFilter): Promise<[Unit[], number]> {
    const where = this.buildWhereClause(query);
    return await Promise.all([
      db.select(unitColumns)
        .from(units)
        .where(where)
        .orderBy(desc(units.id))
        .limit(Number(query.pageSize || 5))
        .offset(countOffset(query.page, query.pageSize)),
      this.count(where)
    ])
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
      this.checkAvailability({ unique: payload.name, selectedId: id.toString() })
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
        deletedAt: new AppDate().unix()
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
      throw new ConstraintException('unit', id)
    }
  }

  static async checkAvailability(query: UniqueCheck) {
    const conditions = [
      isNull(units.deletedAt),
      eq(units.name, query.unique)
    ]

    if (query.selectedId) {
      conditions.push(not(eq(units.id, +query.selectedId)))
    }
    const available = await db
      .select()
      .from(units)
      .where(and(
        ...conditions
      ))

    if (available.length) {
      throw new ConstraintException('unit', undefined, query.unique)
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

  private constructor() { }
}