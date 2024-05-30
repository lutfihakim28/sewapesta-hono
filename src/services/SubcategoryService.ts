import { and, eq, isNull } from 'drizzle-orm';
import { db } from '@/db';
import { subcategoriesTable } from '@/db/schema/subcategories';
import { ParamId } from '@/schemas/ParamIdSchema';
import { SubcategoryRequest } from '@/schemas/subcategories/SubcategoryRequestSchema';
import { SubcategoryResponse } from '@/schemas/subcategories/SubcategoryResponseSchema';
import dayjs from 'dayjs';
import { NotFoundException } from '@/exceptions/NotFoundException';
import { messages } from '@/constatnts/messages';

export abstract class SubcategoryService {
  static async create(request: SubcategoryRequest): Promise<SubcategoryResponse> {
    const createdAt = dayjs().unix();
    const subcategory = db
      .insert(subcategoriesTable)
      .values({
        ...request,
        createdAt,
      })
      .returning()
      .get()

    return subcategory
  }

  static async update(param: ParamId, request: SubcategoryRequest): Promise<SubcategoryRequest> {
    const updatedAt = dayjs().unix()
    const subcategory = await db.transaction(async (transaction) => {
      const existingSubcategoryId = await this.checkRecord(param);
      const subcategory = db
        .update(subcategoriesTable)
        .set({
          ...request,
          updatedAt,
        })
        .where(and(
          eq(subcategoriesTable.id, existingSubcategoryId),
          isNull(subcategoriesTable.deletedAt)
        ))
        .returning()
        .get()

      return subcategory
    })

    return subcategory
  }

  static async delete(param: ParamId) {
    const deletedAt = dayjs().unix();
    await db.transaction(async (transaction) => {
      const existingSubcategoryId = await this.checkRecord(param);
      await transaction.update(subcategoriesTable)
        .set({
          deletedAt,
        })
        .where(and(
          eq(subcategoriesTable.id, existingSubcategoryId),
          isNull(subcategoriesTable.deletedAt)
        ))
    })
  }

  static async checkRecord(param: ParamId) {
    const subcategory = db
      .select({ id: subcategoriesTable.id })
      .from(subcategoriesTable)
      .where(and(
        eq(subcategoriesTable.id, Number(param.id)),
        isNull(subcategoriesTable.deletedAt)
      ))
      .get();


    if (!subcategory) {
      throw new NotFoundException(messages.errorNotFound('subkategori'))
    }

    return subcategory.id
  }
}