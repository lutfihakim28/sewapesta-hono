import { db } from 'db';
import { ParamId } from '@/schemas/ParamIdSchema';
import { and, eq, isNull, gt, asc, desc, or, like, inArray, count } from 'drizzle-orm';
import dayjs from 'dayjs';
import { itemsTable } from 'db/schema/items';
import { ItemCreate, ItemUpdate } from '@/schemas/items/ItemRequestSchema';
import { NotFoundException } from '@/exceptions/NotFoundException';
import { messages } from '@/constatnts/messages';
import { damagedItemsTable } from 'db/schema/damagedItems';
import { orderedItemsTable } from 'db/schema/orderedItems';
import { ItemColumn, ItemFilter } from '@/schemas/items/ItemFilterSchema';
import { countOffset } from '@/utils/countOffset';
import { ownersTable } from 'db/schema/owners';
import { Item } from '@/schemas/items/ItemSchema';
import { dateFormat } from '@/constatnts/dateFormat';
import { ImageService } from './ImageService';

export abstract class ItemService {
  static async getList(query: ItemFilter): Promise<Array<Item>> {
    let sort: 'asc' | 'desc' = 'asc';
    let sortBy: ItemColumn = 'id';

    if (query.sort) {
      sort = query.sort
    }

    if (query.sortBy) {
      sortBy = query.sortBy
    }

    const items = await db.transaction(async (transaction) => {
      const __items = await transaction.query.itemsTable.findMany({
        columns: {
          id: true,
          name: true,
          price: true,
          quantity: true,
        },
        with: {
          owner: {
            columns: {
              id: true,
              name: true,
              phone: true,
            }
          },
          subcategory: {
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
          damaged: {
            where: and(
              isNull(damagedItemsTable.deletedAt),
              gt(damagedItemsTable.quantity, 0)
            ),
            columns: {
              quantity: true,
            }
          },
          ordered: {
            where: and(
              isNull(orderedItemsTable.deletedAt),
              gt(orderedItemsTable.quantity, 0)
            ),
            columns: {
              quantity: true,
            }
          }
        },
        where: and(
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
        ),
        orderBy: sort === 'asc'
          ? asc(itemsTable[sortBy])
          : desc(itemsTable[sortBy]),
        limit: Number(query.limit || 5),
        offset: countOffset(query.page, query.limit),
      })

      const _items = await Promise.all(__items.map(async (item) => {
        const images = await ImageService.getByReference({
          reference: 'items',
          referenceId: item.id,
        })

        const damaged = item.damaged.reduce((a, b) => a + b.quantity, 0)
        const used = item.ordered.reduce((a, b) => a + b.quantity, 0)
        const available = item.quantity - (damaged + used)

        return {
          ...item,
          images,
          quantity: {
            damaged,
            used,
            available,
            total: item.quantity,
          },
          damaged: null,
          ordered: null,
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
          price: true,
          quantity: true,
        },
        with: {
          owner: {
            columns: {
              id: true,
              name: true,
              phone: true,
            }
          },
          unit: {
            columns: {
              id: true,
              name: true,
            }
          },
          subcategory: {
            columns: {
              id: true,
              name: true,
            }
          },
          damaged: {
            columns: {
              createdAt: true,
              description: true,
              id: true,
              quantity: true,
              updatedAt: true,
            }
          },
          ordered: {
            columns: {
              createdAt: true,
              id: true,
              quantity: true,
              updatedAt: true,
            }
          }
        }
      })

      if (!_item) {
        throw new NotFoundException(messages.errorNotFound('barang'))
      }

      const damaged = _item.damaged.reduce((a, b) => a + b.quantity, 0)
      const used = _item.ordered.reduce((a, b) => a + b.quantity, 0)
      const available = _item.quantity - (damaged + used)

      const images = await ImageService.getByReference({
        reference: 'items',
        referenceId: _item.id,
      })

      return {
        ..._item,
        images,
        quantity: {
          total: _item.quantity,
          damaged,
          used,
          available,
        },
        ordered: _item.ordered.map((data) => ({
          ...data,
          createdAt: dayjs.unix(data.createdAt).format(dateFormat),
          updatedAt: data.updatedAt ? dayjs.unix(data.updatedAt).format(dateFormat) : null,
        })),
        damaged: _item.damaged.map((data) => ({
          ...data,
          createdAt: dayjs.unix(data.createdAt).format(dateFormat),
          updatedAt: data.updatedAt ? dayjs.unix(data.updatedAt).format(dateFormat) : null,
        })),
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
          price: Number(request.price),
          subcategoryId: Number(request.subcategoryId),
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
      const existingItemId = await this.checkRecord(param);

      const deletedImages = (request.deletedImages as string[] | undefined) || []

      await Promise.all(deletedImages.map((id) => ImageService.delete({ id })))

      const item = await transaction
        .update(itemsTable)
        .set({
          ...request,
          quantity: Number(request.quantity),
          price: Number(request.price),
          subcategoryId: Number(request.subcategoryId),
          ownerId: Number(request.ownerId),
          unitId: Number(request.unitId),
          updatedAt,
        })
        .where(and(
          eq(itemsTable.id, existingItemId),
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
      throw new NotFoundException(messages.errorNotFound('barang'))
    }

    return item.id
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