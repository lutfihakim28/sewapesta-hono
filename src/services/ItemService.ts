import { db } from '@/db';
import { ParamId } from '@/schemas/ParamIdSchema';
import { and, eq, isNull, gt, asc, desc, or, like, inArray } from 'drizzle-orm';
import dayjs from 'dayjs';
import { itemsTable } from '@/db/schema/items';
import { ItemRequest } from '@/schemas/items/ItemRequestSchema';
import { NotFoundException } from '@/exceptions/NotFoundException';
import { messages } from '@/constatnts/messages';
import { damagedItemsTable } from '@/db/schema/damagedItems';
import { ItemList } from '@/schemas/items/ItemListSchema';
import { ItemDetail } from '@/schemas/items/ItemDetailSchema';
import { orderedItemsTable } from '@/db/schema/orderedItems';
import { ItemColumn, ItemFilter } from '@/schemas/items/ItemFilterSchema';
import { countOffset } from '@/utils/countOffset';
import { ownersTable } from '@/db/schema/owners';

export abstract class ItemService {
  static async getList(query: ItemFilter): Promise<ItemList> {
    let sort: 'asc' | 'desc' = 'asc';
    let sortBy: ItemColumn = 'id';

    if (query.sort) {
      sort = query.sort
    }

    if (query.sortBy) {
      sortBy = query.sortBy
    }

    const items = await db.query.itemsTable.findMany({
      columns: {
        id: true,
        name: true,
        price: true,
        quantity: true,
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
      with: {
        owner: {
          columns: {
            id: true,
            name: true,
          }
        },
        subcategory: {
          columns: {
            name: true,
          }
        },
        unit: {
          columns: {
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
      }
    })

    return items.map((item) => {
      const damaged = item.damaged.reduce((a, b) => a + b.quantity, 0)
      const used = item.ordered.reduce((a, b) => a + b.quantity, 0)
      const available = item.quantity - (damaged + used)
      return {
        ...item,
        quantity: {
          damaged,
          used,
          available,
          total: item.quantity,
        }
      }
    });
  }

  static async get(param: ParamId): Promise<ItemDetail | undefined> {
    const item = await db.query.itemsTable.findFirst({
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
            name: true,
          }
        },
        subcategory: {
          columns: {
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

    if (!item) {
      throw new NotFoundException(messages.errorNotFound('barang'))
    }

    const damaged = item.damaged.reduce((a, b) => a + b.quantity, 0)
    const used = item.ordered.reduce((a, b) => a + b.quantity, 0)
    const available = item.quantity - (damaged + used)

    return {
      ...item,
      quantity: {
        total: item.quantity,
        damaged,
        used,
        available,
      },
      orderedItems: item.ordered,
      damagedItems: item.damaged,
    };
  }

  static async create(request: ItemRequest): Promise<void> {
    const createdAt = dayjs().unix();
    await db
      .insert(itemsTable)
      .values({
        ...request,
        createdAt,
      })
  }

  static async update(param: ParamId, request: ItemRequest): Promise<void> {
    const updatedAt = dayjs().unix();
    await db.transaction(async (transaction) => {
      const existingItemId = await this.checkRecord(param);
      await transaction
        .update(itemsTable)
        .set({
          ...request,
          updatedAt,
        })
        .where(and(
          eq(itemsTable.id, existingItemId),
          isNull(itemsTable.deletedAt),
        ))
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
}