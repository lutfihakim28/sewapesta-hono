import { and, count, eq, getTableColumns, isNull, like } from 'drizzle-orm';
import { Category, CategoryFilter, CategoryRequest } from './Category.schema';
import { categories } from 'db/schema/categories';
import { db } from 'db';
import { countOffset } from '@/lib/utils/countOffset';
import dayjs from 'dayjs';

const { branchId, createdAt, deletedAt, updatedAt, ...columns } = getTableColumns(categories)

export abstract class CategoryService {
  static async list(query: CategoryFilter): Promise<Category[]> {
    const _categories = await db
      .select(columns)
      .from(categories)
      .where(this.buildWhereClause(query))
      .limit(Number(query.pageSize || 5))
      .offset(countOffset(query.page, query.pageSize))

    return _categories
  }

  static async create(payload: CategoryRequest): Promise<Category> {
    const [category] = await db
      .insert(categories)
      .values(payload)
      .returning(columns)

    return category
  }

  static async update(id: number, payload: CategoryRequest): Promise<Category> {
    const [category] = await db
      .update(categories)
      .set(payload)
      .where(and(
        isNull(categories.deletedAt),
        eq(categories.id, id)
      ))
      .returning(columns)

    return category
  }

  static async delete(id: number): Promise<Category> {
    const [category] = await db
      .update(categories)
      .set({
        deletedAt: dayjs().unix()
      })
      .where(and(
        isNull(categories.deletedAt),
        eq(categories.id, id)
      ))
      .returning(columns)

    return category
  }

  static async count(query: CategoryFilter) {
    const item = db
      .select({ count: count() })
      .from(categories)
      .where(this.buildWhereClause(query))
      .get()

    return item?.count || 0
  }

  private static buildWhereClause(query: CategoryFilter) {
    const conditions: ReturnType<typeof and>[] = [
      isNull(categories.deletedAt),
      eq(categories.branchId, query.branchId)
    ]

    if (query.keyword) {
      conditions.push(
        like(categories.name, `%${query.keyword}%`),
      );
    }

    return and(...conditions)
  }
}