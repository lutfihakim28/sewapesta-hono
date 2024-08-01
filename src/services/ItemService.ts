import { db } from 'db';
import { ParamId } from '@/schemas/ParamIdSchema';
import { and, eq, isNull, asc, desc, or, like, inArray, count } from 'drizzle-orm';
import dayjs from 'dayjs';
import { itemsTable } from 'db/schema/items';
import { ItemCreate, ItemUpdate } from '@/schemas/items/ItemRequestSchema';
import { NotFoundException } from '@/exceptions/NotFoundException';
import { messages } from '@/constatnts/messages';
import { ItemColumn, ItemFilter } from '@/schemas/items/ItemFilterSchema';
import { countOffset } from '@/utils/countOffset';
import { ownersTable } from 'db/schema/owners';
import { Item } from '@/schemas/items/ItemSchema';
import { ImageService } from './ImageService';
import { ItemPatchOvertime } from '@/schemas/items/ItemPatchOvertimeSchema';

export abstract class ItemService {
  static async getList(query: ItemFilter): Promise<Array<Item>> {
    let sort: 'asc' | 'desc' = 'asc';
    let sortBy: ItemColumn = 'id';
    let categories: Array<number> | undefined = undefined;

    if (query.sort) {
      sort = query.sort
    }

    if (query.sortBy) {
      sortBy = query.sortBy
    }

    if (query.categories) {
      categories = query.categories.split('-').map((id) => Number(id));
    }

    const items = await db.transaction(async (transaction) => {
      const __items = await transaction.query.itemsTable.findMany({
        columns: {
          id: true,
          name: true,
          quantity: true,
          code: true,
        },
        with: {
          owner: {
            columns: {
              id: true,
              name: true,
              phone: true,
              type: true,
            }
          },
          category: {
            columns: {
              id: true,
              name: true,
            }
          },
          unit: {
            columns: {
              id: true,
              name: true,
            }
          },
        },
        where: and(
          isNull(itemsTable.deletedAt),
          categories
            ? inArray(
              itemsTable.categoryId,
              categories
            )
            : undefined,
          query.keyword
            ? or(
              like(itemsTable.name, `%${query.keyword}%`),
              inArray(
                itemsTable.ownerId,
                db
                  .select({ id: ownersTable.id })
                  .from(ownersTable)
                  .where(like(ownersTable.name, `%${query.keyword}%`)),
              )
            )
            : undefined,
        ),
        orderBy: sort === 'asc'
          ? asc(itemsTable[sortBy])
          : desc(itemsTable[sortBy]),
        limit: Number(query.pageSize || 5),
        offset: countOffset(query.page, query.pageSize),
      })

      const _items = await Promise.all(__items.map(async (item) => {
        const images = await ImageService.getByReference({
          reference: 'items',
          referenceId: item.id,
        })

        return {
          ...item,
          images,
        }
      }))

      return _items;
    })

    return items;
  }

  static async get(param: ParamId): Promise<Item> {
    const item = await db.transaction(async (transaction) => {
      const _item = await transaction.query.itemsTable.findFirst({
        where: and(
          eq(itemsTable.id, Number(param.id)),
          isNull(itemsTable.deletedAt),
        ),
        columns: {
          id: true,
          name: true,
          quantity: true,
          code: true,
        },
        with: {
          owner: {
            columns: {
              id: true,
              name: true,
              phone: true,
              type: true,
            }
          },
          unit: {
            columns: {
              id: true,
              name: true,
            }
          },
          category: {
            columns: {
              id: true,
              name: true,
            }
          },
        }
      })

      if (!_item) {
        throw new NotFoundException(messages.errorNotFound('barang'))
      }

      const images = await ImageService.getByReference({
        reference: 'items',
        referenceId: _item.id,
      })

      return {
        ..._item,
        images,
      };
    });

    return item;
  }

  static async create(request: ItemCreate): Promise<void> {
    const createdAt = dayjs().unix();
    await db.transaction(async (transaction) => {
      const item = await transaction
        .insert(itemsTable)
        .values({
          ...request,
          quantity: Number(request.quantity),
          categoryId: Number(request.categoryId),
          ownerId: Number(request.ownerId),
          unitId: Number(request.unitId),
          createdAt,
        })
        .returning({
          id: itemsTable.id,
        })

      await ImageService.upload({
        reference: 'items',
        referenceId: item[0].id,
        images: request.images,
      })
    })
  }

  static async update(param: ParamId, request: ItemUpdate): Promise<void> {
    const updatedAt = dayjs().unix();
    await db.transaction(async (transaction) => {
      const existingItem = await this.checkRecord(param);

      const deletedImages = request.deletedImages
        ? request.deletedImages.split(',')
        : []

      await Promise.all(deletedImages.map((id) => ImageService.delete({ id })))

      const item = await transaction
        .update(itemsTable)
        .set({
          ...request,
          quantity: Number(request.quantity),
          categoryId: Number(request.categoryId),
          ownerId: Number(request.ownerId),
          unitId: Number(request.unitId),
          updatedAt,
        })
        .where(and(
          eq(itemsTable.id, existingItem.id),
          isNull(itemsTable.deletedAt),
        ))
        .returning({
          id: itemsTable.id,
        })

      await ImageService.upload({
        reference: 'items',
        referenceId: item[0].id,
        images: request.images,
      })
    })
  }

  static async patchOvertime(param: ParamId, request: ItemPatchOvertime): Promise<void> {
    const updatedAt = dayjs().unix();
    await db.transaction(async (transaction) => {
      const existingItem = await this.checkRecord(param);

      await transaction
        .update(itemsTable)
        .set({
          ...request,
          updatedAt,
        })
        .where(and(
          eq(itemsTable.id, existingItem.id),
          isNull(itemsTable.deletedAt),
        ))
        .returning({
          id: itemsTable.id,
        })
    })
  }

  static async delete(param: ParamId) {
    const deletedAt = dayjs().unix();
    await db.transaction(async (transaction) => {
      const existingItem = await this.checkRecord(param);

      const images = await ImageService.getByReference({
        reference: 'items',
        referenceId: existingItem.id,
      })

      await transaction
        .update(itemsTable)
        .set({
          deletedAt,
        })
        .where(and(
          eq(itemsTable.id, existingItem.id),
          isNull(itemsTable.deletedAt),
        ))

      await Promise.all(images.map((image) => ImageService.delete({ id: image.id.toString() })))
    })
  }

  // static async getOrderedItems(param: ParamId): Promise<OrderedItem> {

  // }

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
      throw new NotFoundException(messages.errorNotFound('barang'))
    }

    return item
  }

  static async count(query: ItemFilter): Promise<number> {
    const item = db
      .select({ count: count() })
      .from(itemsTable)
      .where(and(
        isNull(itemsTable.deletedAt),
        query.keyword
          ? or(
            like(itemsTable.name, `%${query.keyword}%`),
            inArray(
              itemsTable.ownerId,
              db
                .select({ id: ownersTable.id })
                .from(ownersTable)
                .where(like(ownersTable.name, `%${query.keyword}%`)),
            )
          )
          : undefined
      ))
      .get();

    return item ? item.count : 0;
  }
}