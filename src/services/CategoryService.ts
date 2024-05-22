import { and, eq, isNull } from 'drizzle-orm';
import { db } from '@/db';
import { categoriesTable } from '@/db/schema/categories';
import { subCategoriesTable } from '@/db/schema/subCategories';
import { ParamId } from '@/schemas/ParamIdSchema';
import { CategoryRequest, CategoryRelationsResponse, CategoryResponse } from '@/schemas/CategorySchema';

export abstract class CategoryService {
  static async getCategories(): Promise<Array<CategoryRelationsResponse>> {
    const categories = await db.query.categoriesTable.findMany({
      where: isNull(categoriesTable.deletedAt),
      with: {
        subCategories: {
          where: isNull(subCategoriesTable.deletedAt)
        },
      }
    })

    return categories;
  }

  static async getCategory(params: ParamId): Promise<CategoryRelationsResponse | undefined> {
    const category = await db.query.categoriesTable.findFirst({
      where: and(eq(categoriesTable.id, Number(params.id)), isNull(categoriesTable.deletedAt)),
      with: {
        subCategories: {
          where: isNull(subCategoriesTable.deletedAt)
        },
      }
    })

    return category
  }

  static async createCategory(request: CategoryRequest): Promise<CategoryResponse> {
    const category = db
      .insert(categoriesTable)
      .values(request)
      .returning()
      .get()

    return category
  }

  static async updateCategory(params: ParamId, request: CategoryRequest): Promise<CategoryResponse> {
    const category = db
      .update(categoriesTable)
      .set(request)
      .where(eq(categoriesTable.id, Number(params.id)))
      .returning()
      .get()

    return category
  }

  static async deleteCategory(params: ParamId) {
    await db.update(subCategoriesTable)
      .set({
        deletedAt: new Date(),
      })
      .where(eq(subCategoriesTable.categoryId, Number(params.id)))

    await db.update(categoriesTable)
      .set({
        deletedAt: new Date(),
      })
      .where(eq(categoriesTable.id, Number(params.id)))
  }
}