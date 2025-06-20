import { and, asc, count, desc, eq, isNull, like, not, SQL } from 'drizzle-orm';
import { Category, CategoryCreateMany, CategoryFilter, CategoryRequest } from './Category.schema';
import { categories } from 'db/schema/categories';
import { db } from 'db';
import { countOffset } from '@/utils/helpers/count-offset';
import { categoryColumns } from './Category.column';
import { UniqueCheck } from '@/utils/schemas/UniqueCheck.schema';
import { AppDate } from '@/utils/libs/AppDate';
import { items } from 'db/schema/items';
import { Option } from '@/utils/schemas/Option.schema';
import { ConstraintException } from '@/utils/exceptions/ConstraintException';
import { UniqueConstraintException } from '@/utils/exceptions/UniqueConstraintException';

export class CategoryService {
  static async list(query: CategoryFilter): Promise<[Category[], number]> {
    const where = this.buildWhereClause(query);
    const result = await Promise.all([
      db.select({
        ...categoryColumns,
        itemCount: count(items.id).mapWith(Number)
      })
        .from(categories)
        .where(where)
        .leftJoin(items, and(
          isNull(items.deletedAt),
          eq(items.categoryId, categories.id)
        ))
        .orderBy(desc(categories.id))
        .groupBy(categories.id)
        .limit(Number(query.pageSize || 5))
        .offset(countOffset(query.page, query.pageSize)),
      this.count(where)
    ])

    return result
  }

  static async get(id: number): Promise<Category> {
    const [category] = await db.select({
      ...categoryColumns,
      itemCount: count(items.id).mapWith(Number)
    })
      .from(categories)
      .where(and(
        isNull(categories.deletedAt),
        eq(categories.id, id)
      ))
      .leftJoin(items, and(
        isNull(items.deletedAt),
        eq(items.categoryId, categories.id)
      ))
      .orderBy(desc(categories.id))
      .groupBy(categories.id)
      .limit(1)

    if (!category) {
      throw new ConstraintException('category', id)
    }

    return category
  }

  static async createMany(payload: CategoryCreateMany) {
    const _categories = await db
      .insert(categories)
      .values(payload.names.map(name => ({ name })))
      .onConflictDoNothing()
      .returning(categoryColumns)

    return _categories.map((category) => ({
      ...category,
      itemCount: 0
    }))
  }

  static async create(payload: CategoryRequest): Promise<Category> {
    await this.checkAvailability({ unique: payload.name })
    const [category] = await db
      .insert(categories)
      .values(payload)
      .returning(categoryColumns)

    return {
      ...category,
      itemCount: 0
    }
  }

  static async update(id: number, payload: CategoryRequest): Promise<Category> {
    await Promise.all([
      this.check(id),
      this.checkAvailability({ unique: payload.name, selectedId: id.toString() })
    ])
    const [category] = await db
      .update(categories)
      .set(payload)
      .where(and(
        isNull(categories.deletedAt),
        eq(categories.id, id)
      ))
      .returning(categoryColumns)

    return await this.get(category.id)
  }

  static async delete(id: number): Promise<void> {
    await this.check(id)
    await db
      .update(categories)
      .set({
        deletedAt: new AppDate().unix()
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
      throw new ConstraintException('category', id)
    }
  }

  static async checkAvailability(query: UniqueCheck) {
    const conditions = [
      isNull(categories.deletedAt),
      eq(categories.name, query.unique)
    ]

    if (query.selectedId) {
      conditions.push(not(eq(categories.id, +query.selectedId)))
    }
    const available = await db
      .select()
      .from(categories)
      .where(and(
        ...conditions
      ))

    if (available.length) {
      throw new UniqueConstraintException('category', undefined, query.unique)
    }
  }

  static async options(): Promise<Option[]> {
    const _categories = await db
      .select({
        label: categories.name,
        value: categories.id
      })
      .from(categories)
      .where(isNull(categories.deletedAt))
      .orderBy(asc(categories.name))

    return _categories
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

  private constructor() { }
}