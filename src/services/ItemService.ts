import { db } from '@/db';
import { ParamId } from '@/schemas/ParamIdSchema';
import { and, eq, isNull } from 'drizzle-orm';
import dayjs from 'dayjs';
import { itemsTable } from '@/db/schema/items';
import { ExtendedItemResponse } from '@/schemas/items/ExtendedItemResponseSchema';
import { ItemResponse } from '@/schemas/items/ItemResponseSchema';
import { ItemRequest } from '@/schemas/items/ItemRequestSchema';
import { NotFoundException } from '@/exceptions/NotFoundException';

export abstract class ItemService {
  static async getList(): Promise<Array<ExtendedItemResponse>> {
    const items = db.query.itemsTable.findMany({
      where: isNull(itemsTable.deletedAt),
      with: {
        owner: true,
        subcategory: true,
      }
    })

    return items;
  }

  static async get(param: ParamId): Promise<ExtendedItemResponse | undefined> {
    const item = db.query.itemsTable.findFirst({
      where: and(
        eq(itemsTable.id, Number(param.id)),
        isNull(itemsTable.deletedAt),
      ),
      with: {
        owner: true,
        subcategory: true,
      }
    })

    if (!item) {
      throw new NotFoundException('Barang tidak ditemukan.')
    }

    return item;
  }

  static async create(request: ItemRequest): Promise<ItemResponse> {
    const createdAt = dayjs().unix();
    const item = db
      .insert(itemsTable)
      .values({
        ...request,
        createdAt,
      })
      .returning()
      .get()

    return item
  }

  static async update(param: ParamId, request: ItemRequest): Promise<ItemResponse> {
    const updatedAt = dayjs().unix();
    const item = await db.transaction(async (transaction) => {
      const existingItemId = await this.checkRecord(param);
      const newItem = transaction
        .update(itemsTable)
        .set({
          ...request,
          updatedAt,
        })
        .where(and(
          eq(itemsTable.id, existingItemId),
          isNull(itemsTable.deletedAt),
        ))
        .returning()
        .get()

      return newItem;
    })

    return item;
  }

  static async delete(param: ParamId) {
    const deletedAt = dayjs().unix();
    await db.transaction(async (transaction) => {
      const existingItemId = await this.checkRecord(param);
      await transaction
        .update(itemsTable)
        .set({
          deletedAt,
        })
        .where(and(
          eq(itemsTable.id, existingItemId),
          isNull(itemsTable.deletedAt),
        ))
    })
  }

  static async checkRecord(param: ParamId) {
    const item = db
      .select({ id: itemsTable.id })
      .from(itemsTable)
      .where(and(
        eq(itemsTable.id, Number(param.id)),
        isNull(itemsTable.deletedAt)
      ))
      .get();


    if (!item) {
      throw new NotFoundException('Barang tidak ditemukan.')
    }

    return item.id
  }
}