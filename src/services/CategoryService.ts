import { and, eq, isNull } from 'drizzle-orm';
import { db } from 'db';
import { categoriesTable } from 'db/schema/categories';
import { subcategoriesTable } from 'db/schema/subcategories';
import { ParamId } from '@/schemas/ParamIdSchema';
import { CategoryRequest } from '@/schemas/categories/CategoryRequestSchema';
import { SubcategoryService } from './SubcategoryService';
import dayjs from 'dayjs';
import { NotFoundException } from '@/exceptions/NotFoundException';
import { messages } from '@/constatnts/messages';
import { Category } from '@/schemas/categories/CategorySchema';

export abstract class CategoryService {
  static async getList(): Promise<Array<Category>> {
    const categories = await db.query.categoriesTable.findMany({
      columns: {
        id: true,
        name: true,
      },
      where: isNull(categoriesTable.deletedAt),
      with: {
        subcategories: {
          columns: {
            id: true,
            name: true,
          },
          where: isNull(subcategoriesTable.deletedAt),
        },
      }
    })

    return categories
  }

  static async get(param: ParamId): Promise<Category | undefined> {
    const category = await db.query.categoriesTable.findFirst({
      columns: {
        id: true,
        name: true,
      },
      where: and(eq(categoriesTable.id, Number(param.id)), isNull(categoriesTable.deletedAt)),
      with: {
        subcategories: {
          columns: {
            id: true,
            name: true,
          },
          where: isNull(subcategoriesTable.deletedAt)
        },
      }
    })

    if (!category) {
      throw new NotFoundException(messages.errorNotFound('kategori'))
    }

    return category
  }

  static async create(request: CategoryRequest): Promise<void> {
    const createdAt = dayjs().unix();
    await db
      .insert(categoriesTable)
      .values({
        ...request,
        createdAt,
      })
  }

  static async update(param: ParamId, request: CategoryRequest): Promise<void> {
    const updatedAt = dayjs().unix();
    await db.transaction(async (transaction) => {
      const existingCategoryId = await this.checkRecord(param);
      await transaction
        .update(categoriesTable)
        .set({
          ...request,
          updatedAt,
        })
        .where(eq(categoriesTable.id, existingCategoryId))
    })
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