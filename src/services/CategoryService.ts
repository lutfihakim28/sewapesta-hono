import { and, eq, isNull, sql } from 'drizzle-orm';
import { db } from 'db';
import { categories } from 'db/schema/categories';
import { ParamId } from '@/schemas/ParamIdSchema';
import { CategoryRequest } from '@/schemas/categories/CategoryRequestSchema';
import dayjs from 'dayjs';
import { NotFoundException } from '@/lib/exceptions/NotFoundException';
import { MESSAGES } from '@/lib/constants/MESSAGES';
import { Category } from '@/schemas/categories/CategorySchema';
import { items } from 'db/schema/items';

export abstract class CategoryService {
  static async getList(): Promise<Array<Category>> {
    const _categories = db
      .select({
        id: categories.id,
        name: categories.name,
        itemsCount: sql<number>`COUNT(
          CASE WHEN ${items.id} IS NOT NULL THEN 1 END
        )`
      })
      .from(categories)
      .leftJoin(items, eq(items.categoryId, categories.id))
      .where(and(
        isNull(categories.deletedAt),
        isNull(items.deletedAt),
      ))
      .groupBy(categories.id)
    return _categories
  }

  static async get(param: ParamId): Promise<Category> {
    const category = await db.query.categories.findFirst({
      columns: {
        id: true,
        name: true,
      },
      where: and(eq(categories.id, Number(param.id)), isNull(categories.deletedAt)),
    })

    if (!category) {
      throw new NotFoundException(MESSAGES.errorNotFound('kategori'))
    }

    return category
  }

  static async create(request: CategoryRequest): Promise<void> {
    const createdAt = dayjs().unix();
    await db
      .insert(categories)
      .values({
        ...request,
        createdAt,
      })
  }

  static async update(param: ParamId, request: CategoryRequest): Promise<void> {
    const updatedAt = dayjs().unix();
    await db.transaction(async (transaction) => {
      const existingCategory = await this.get(param);
      await transaction
        .update(categories)
        .set({
          ...request,
          updatedAt,
        })
        .where(eq(categories.id, existingCategory.id))
    })
  }

  static async delete(param: ParamId) {
    const deletedAt = dayjs().unix();
    await db.transaction(async (transaction) => {
      const existingCategory = await this.get(param);
      await transaction.update(categories)
        .set({
          deletedAt,
        })
        .where(eq(categories.id, existingCategory.id))

      await transaction.update(items)
        .set({
          categoryId: null,
        })
        .where(eq(items.categoryId, existingCategory.id))
    })
  }
}