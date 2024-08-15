import { db } from 'db';
import { ParamId } from '@/schemas/ParamIdSchema';
import { and, eq, isNull, asc, desc, or, like, inArray, count } from 'drizzle-orm';
import dayjs from 'dayjs';
import { items } from 'db/schema/items';
import { ItemCreate, ItemUpdate } from '@/schemas/items/ItemRequestSchema';
import { NotFoundException } from '@/exceptions/NotFoundException';
import { messages } from '@/constatnts/messages';
import { ItemColumn, ItemFilter } from '@/schemas/items/ItemFilterSchema';
import { countOffset } from '@/utils/countOffset';
import { owners } from 'db/schema/owners';
import { Item } from '@/schemas/items/ItemSchema';
import { ImageService } from './ImageService';
import { ItemPatchOvertime } from '@/schemas/items/ItemPatchOvertimeSchema';
import { StockMutationService } from './StockMutationService';
import { StockMutationTypeEnum } from '@/enums/StockMutationTypeEnum';
import { products } from 'db/schema/products';
import { productItems } from 'db/schema/productItems';

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

    const allItems = await db.transaction(async (transaction) => {
      const __items = await transaction.query.items.findMany({
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
            },
          },
          unit: {
            columns: {
              id: true,
              name: true,
            }
          },
        },
        where: and(
          isNull(items.deletedAt),
          categories
            ? inArray(
              items.categoryId,
              categories
            )
            : undefined,
          query.keyword
            ? or(
              like(items.name, `%${query.keyword}%`),
              inArray(
                items.ownerId,
                db
                  .select({ id: owners.id })
                  .from(owners)
                  .where(like(owners.name, `%${query.keyword}%`)),
              )
            )
            : undefined,
        ),
        orderBy: sort === 'asc'
          ? asc(items[sortBy])
          : desc(items[sortBy]),
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

    return allItems;
  }

  static async get(param: ParamId): Promise<Item> {
    const item = await db.transaction(async (transaction) => {
      const _item = await transaction.query.items.findFirst({
        where: and(
          eq(items.id, Number(param.id)),
          isNull(items.deletedAt),
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
        .insert(items)
        .values({
          ...request,
          quantity: Number(request.quantity),
          categoryId: Number(request.categoryId),
          ownerId: Number(request.ownerId),
          unitId: Number(request.unitId),
          createdAt,
        })
        .returning({
          id: items.id,
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
      const existingItem = await this.get(param);

      const deletedImages = request.deletedImages
        ? request.deletedImages.split(',')
        : []

      await Promise.all(deletedImages.map((id) => ImageService.delete({ id })))

      const item = await transaction
        .update(items)
        .set({
          ...request,
          quantity: Number(request.quantity),
          categoryId: Number(request.categoryId),
          ownerId: Number(request.ownerId),
          unitId: Number(request.unitId),
          updatedAt,
        })
        .where(and(
          eq(items.id, existingItem.id),
          isNull(items.deletedAt),
        ))
        .returning({
          id: items.id,
        })

      await ImageService.upload({
        reference: 'items',
        referenceId: item[0].id,
        images: request.images,
      })
    })
  }

  static async getItemsByProducts(productIds: Array<number>) {
    const _items = await db
      .select({
        id: items.id,
        productId: products.id,
      })
      .from(items)
      .leftJoin(productItems, eq(productItems.itemId, items.id))
      .leftJoin(products, eq(productItems.productId, products.id))
      .where(inArray(products.id, productIds))

    return _items
  }

  static async delete(param: ParamId) {
    const deletedAt = dayjs().unix();
    await db.transaction(async (transaction) => {
      const existingItem = await this.get(param);

      const images = await ImageService.getByReference({
        reference: 'items',
        referenceId: existingItem.id,
      })

      await transaction
        .update(items)
        .set({
          deletedAt,
        })
        .where(and(
          eq(items.id, existingItem.id),
          isNull(items.deletedAt),
        ))

      await Promise.all(images.map((image) => ImageService.delete({ id: image.id.toString() })))
    })
  }

  static async count(query: ItemFilter): Promise<number> {
    const item = db
      .select({ count: count() })
      .from(items)
      .where(and(
        isNull(items.deletedAt),
        query.keyword
          ? or(
            like(items.name, `%${query.keyword}%`),
            inArray(
              items.ownerId,
              db
                .select({ id: owners.id })
                .from(owners)
                .where(like(owners.name, `%${query.keyword}%`)),
            )
          )
          : undefined
      ))
      .get();

    return item ? item.count : 0;
  }
}