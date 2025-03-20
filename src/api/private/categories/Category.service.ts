import { and, count, eq, isNull, like, not, SQL } from 'drizzle-orm';
import { Category, CategoryFilter, CategoryRequest } from './Category.schema';
import { categories } from 'db/schema/categories';
import { db } from 'db';
import { countOffset } from '@/lib/utils/countOffset';
import dayjs from 'dayjs';
import { NotFoundException } from '@/lib/exceptions/NotFoundException';
import { messages } from '@/lib/constants/messages';
import { categoryColumns } from './Category.column';
import { BadRequestException } from '@/lib/exceptions/BadRequestException';

export abstract class CategoryService {
  static async list(query: CategoryFilter): Promise<[Category[], number]> {
    const where = this.buildWhereClause(query);
    const result = await Promise.all([
      db.select(categoryColumns)
        .from(categories)
        .where(where)
        .limit(Number(query.pageSize || 5))
        .offset(countOffset(query.page, query.pageSize)),
      this.count(where)
    ])

    return result
  }

  static async create(payload: CategoryRequest): Promise<void> {
    await this.checkAvailability(payload.name)
    await db
      .insert(categories)
      .values(payload)
  }

  static async update(id: number, payload: CategoryRequest): Promise<void> {
    await Promise.all([
      this.check(id),
      this.checkAvailability(payload.name, id)
    ])
    await db
      .update(categories)
      .set(payload)
      .where(and(
        isNull(categories.deletedAt),
        eq(categories.id, id)
      ))
  }

  static async delete(id: number): Promise<void> {
    await this.check(id)
    await db
      .update(categories)
      .set({
        deletedAt: dayjs().unix()
      })
      .where(and(
        isNull(categories.deletedAt),
        eq(categories.id, id)
      ))
  }

  static async check(id: number) {
    const [category] = await db
      .select(categoryColumns)
      .from(categories)
      .where(and(
        eq(categories.id, id),
        isNull(categories.deletedAt)
      ))

    if (!category) {
      throw new NotFoundException(messages.errorConstraint('Category'))
    }
  }

  static async checkAvailability(name: string, id?: number) {
    const conditions = [
      isNull(categories.deletedAt),
      eq(categories.name, name)
    ]

    if (id) {
      conditions.push(not(eq(categories.id, id)))
    }
    const available = await db
      .select()
      .from(categories)
      .where(and(
        ...conditions
      ))

    if (available.length) {
      throw new BadRequestException(messages.uniqueConstraint(`Category\'s name (${name})`))
    }
  }

  private static async count(query?: SQL<unknown>) {
    const [item] = await db
      .select({ count: count().mapWith(Number) })
      .from(categories)
      .where(query)

    return item?.count || 0
  }

  private static buildWhereClause(query: CategoryFilter) {
    const conditions: ReturnType<typeof and>[] = [
      isNull(categories.deletedAt),
    ]

    if (query.keyword) {
      conditions.push(
        like(categories.name, `%${query.keyword}%`),
      );
    }

    return and(...conditions)
  }
}