import { and, eq, isNull } from 'drizzle-orm';
import { db } from '@/db';
import { categoriesTable } from '@/db/schema/categories';
import { subcategoriesTable } from '@/db/schema/subcategories';
import { ParamId } from '@/schemas/ParamIdSchema';
import { ExtendedCategoryResponse } from '@/schemas/categories/ExtendedCategoryResponseSchema';
import { CategoryRequest } from '@/schemas/categories/CategoryRequestSchema';
import { CategoryResponse } from '@/schemas/categories/CategoryResponseSchema';
import { SubcategoryService } from './SubcategoryService';
import dayjs from 'dayjs';
import { NotFoundException } from '@/exceptions/NotFoundException';
import { messages } from '@/constatnts/messages';

export abstract class CategoryService {
  static async getList(): Promise<Array<ExtendedCategoryResponse>> {
    const categories = await db.query.categoriesTable.findMany({
      where: isNull(categoriesTable.deletedAt),
      with: {
        subcategories: {
          where: isNull(subcategoriesTable.deletedAt)
        },
      }
    })

    return categories
  }

  static async get(param: ParamId): Promise<ExtendedCategoryResponse | undefined> {
    const category = await db.query.categoriesTable.findFirst({
      where: and(eq(categoriesTable.id, Number(param.id)), isNull(categoriesTable.deletedAt)),
      with: {
        subcategories: {
          where: isNull(subcategoriesTable.deletedAt)
        },
      }
    })

    if (!category) {
      throw new NotFoundException(messages.errorNotFound('kategori'))
    }

    return category
  }

  static async create(request: CategoryRequest): Promise<CategoryResponse> {
    const createdAt = dayjs().unix();
    const category = db
      .insert(categoriesTable)
      .values({
        ...request,
        createdAt,
      })
      .returning()
      .get()

    return category
  }

  static async update(param: ParamId, request: CategoryRequest): Promise<CategoryResponse> {
    const updatedAt = dayjs().unix();
    const category = await db.transaction(async (transaction) => {
      const existingCategoryId = await this.checkRecord(param);

      const newCategory = transaction
        .update(categoriesTable)
        .set({
          ...request,
          updatedAt,
        })
        .where(eq(categoriesTable.id, existingCategoryId))
        .returning()
        .get()

      return newCategory
    })

    return category
  }

  static async delete(param: ParamId) {
    const deletedAt = dayjs().unix();
    await db.transaction(async (transaction) => {
      const existingCategoryId = await this.checkRecord(param);

      await SubcategoryService.delete(param)

      await transaction.update(categoriesTable)
        .set({
          deletedAt,
        })
        .where(eq(categoriesTable.id, existingCategoryId))
    })
  }

  static async checkRecord(param: ParamId) {
    const category = db
      .select({ id: categoriesTable.id })
      .from(categoriesTable)
      .where(and(
        eq(categoriesTable.id, Number(param.id)),
        isNull(categoriesTable.deletedAt)
      ))
      .get();


    if (!category) {
      throw new NotFoundException(messages.errorNotFound('kategori'))
    }

    return category.id
  }
}