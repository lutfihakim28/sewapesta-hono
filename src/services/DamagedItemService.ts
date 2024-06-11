import { db } from '@/db';
import { ItemService } from './ItemService';
import { damagedItemsTable } from '@/db/schema/damagedItems';
import dayjs from 'dayjs';
import { ParamId } from '@/schemas/ParamIdSchema';
import { DamagedItemParam, DamagedItemRequest } from '@/schemas/damagedItems/DamagedItemRequestSchema';
import { NotFoundException } from '@/exceptions/NotFoundException';
import { messages } from '@/constatnts/messages';
import { and, eq, isNull } from 'drizzle-orm';
import { BadRequestException } from '@/exceptions/BadRequestException';

export abstract class DamagedItemService {
  static async create(param: ParamId, request: DamagedItemRequest) {
    const damagedItem = db.transaction(async (transaction) => {
      const existingItemId = await ItemService.checkRecord(param);

      const _damagedItem = transaction
        .insert(damagedItemsTable)
        .values({
          ...request,
          itemId: existingItemId,
          createdAt: dayjs().unix(),
        })
        .returning()
        .get();

      return _damagedItem;
    })

    return damagedItem;
  }

  static async update(param: DamagedItemParam, request: DamagedItemRequest) {
    const damagedItem = db.transaction(async (transaction) => {
      const existingItemId = await ItemService.checkRecord(param);
      const existingDamagedItem = await this.checkRecord(param);

      const remainingQuantity = existingDamagedItem.quantity - request.quantity;

      if (remainingQuantity < 0) {
        throw new BadRequestException(['Kuantitas melebihi data kuantitas barang yang rusak.'])
      }

      const _damagedItem = transaction
        .update(damagedItemsTable)
        .set({
          updatedAt: dayjs().unix(),
          quantity: remainingQuantity,
          deletedAt: remainingQuantity === 0 ? dayjs().unix() : null,
        })
        .where(and(
          eq(damagedItemsTable.id, existingDamagedItem.id),
          eq(damagedItemsTable.itemId, existingItemId),
          isNull(damagedItemsTable.deletedAt),
        ))
        .returning()
        .get()

      return _damagedItem;
    })

    return damagedItem;
  }

  static async checkRecord(param: DamagedItemParam) {
    const damagedItem = db
      .select({ id: damagedItemsTable.id, quantity: damagedItemsTable.quantity })
      .from(damagedItemsTable)
      .where(and(
        eq(damagedItemsTable.id, Number(param.damagedItemId)),
        eq(damagedItemsTable.itemId, Number(param.id)),
        isNull(damagedItemsTable.deletedAt),
      ))
      .get();


    if (!damagedItem) {
      throw new NotFoundException(messages.errorNotFound('barang'))
    }

    return damagedItem
  }
}