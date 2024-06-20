import { and, eq, isNull } from 'drizzle-orm';
import { db } from 'db';
import { subcategoriesTable } from 'db/schema/subcategories';
import { ParamId } from '@/schemas/ParamIdSchema';
import { SubcategoryRequest } from '@/schemas/subcategories/SubcategoryRequestSchema';
import dayjs from 'dayjs';
import { NotFoundException } from '@/exceptions/NotFoundException';
import { messages } from '@/constatnts/messages';

export abstract class SubcategoryService {
  static async create(request: SubcategoryRequest): Promise<void> {
    const createdAt = dayjs().unix();
    await db
      .insert(subcategoriesTable)
      .values({
        ...request,
        createdAt,
      })
  }

  static async update(param: ParamId, request: SubcategoryRequest): Promise<void> {
    const updatedAt = dayjs().unix()
    await db.transaction(async (transaction) => {
      const existingSubcategory = await this.checkRecord(param);
      await transaction
        .update(subcategoriesTable)
        .set({
          ...request,
          updatedAt,
        })
        .where(and(
          eq(subcategoriesTable.id, existingSubcategory.id),
          isNull(subcategoriesTable.deletedAt)
        ))
    })
  }

  static async delete(param: ParamId) {
    const deletedAt = dayjs().unix();
    await db.transaction(async (transaction) => {
      const existingSubcategory = await this.checkRecord(param);
      await transaction.update(subcategoriesTable)
        .set({
          deletedAt,
        })
        .where(and(
          eq(subcategoriesTable.id, existingSubcategory.id),
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

    return subcategory
  }
}