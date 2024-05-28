import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { subcategoriesTable } from '@/db/schema/subcategories';
import { ParamId } from '@/schemas/ParamIdSchema';
import { SubcategoryRequest } from '@/schemas/subcategories/SubcategoryRequestSchema';
import { SubcategoryResponse } from '@/schemas/subcategories/SubcategoryResponseSchema';
import dayjs from 'dayjs';

export abstract class SubcategoryService {
  static async create(request: SubcategoryRequest): Promise<SubcategoryResponse> {
    const createdAt = dayjs().unix();
    const category = db
      .insert(subcategoriesTable)
      .values({
        ...request,
        createdAt,
      })
      .returning()
      .get()

    return category
  }

  static async update(param: ParamId, request: SubcategoryRequest): Promise<SubcategoryRequest> {
    const updatedAt = dayjs().unix()
    const category = db
      .update(subcategoriesTable)
      .set({
        ...request,
        updatedAt,
      })
      .where(eq(subcategoriesTable.id, Number(param.id)))
      .returning()
      .get()

    return category
  }

  static async delete(param: ParamId) {
    const deletedAt = dayjs().unix();
    await db.update(subcategoriesTable)
      .set({
        deletedAt,
      })
      .where(eq(subcategoriesTable.categoryId, Number(param.id)))
  }
}