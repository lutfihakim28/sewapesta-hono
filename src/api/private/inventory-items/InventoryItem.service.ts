import { buildOrderBy } from '@/lib/utils/build-order-by';
import { InventoryItem, InventoryItemFilter, InventoryItemList, InventoryItemRequest } from './InventoryItem.schema';
import { inventoryItems } from 'db/schema/inventory-items';
import { and, count, eq, isNull, like, or } from 'drizzle-orm';
import { items } from 'db/schema/items';
import { profiles } from 'db/schema/profiles';
import { db } from 'db';
import { users } from 'db/schema/users';
import { categories } from 'db/schema/categories';
import { units } from 'db/schema/units';
import { countOffset } from '@/lib/utils/count-offset';
import { inventoryItemColumns } from './InventoryItem.column';
import { categoryColumns } from '../categories/Category.column';
import { unitColumns } from '../units/Unit.column';
import { NotFoundException } from '@/lib/exceptions/NotFoundException';
import { messages } from '@/lib/constants/messages';
import { ItemService } from '../items/Item.service';
import { ItemTypeEnum } from '@/lib/enums/ItemTypeEnum';
import { UserService } from '../users/User.service';
import { RoleEnum } from '@/lib/enums/RoleEnum';
import dayjs from 'dayjs';
import { inventoryItemMutations } from 'db/schema/inventory-item-mutations';
import { ItemMutationDescriptionEnum } from '@/lib/enums/ItemMutationDescriptionEnum';

export class InventoryItemService {
  static async list(query: InventoryItemFilter): Promise<[InventoryItemList, number]> {
    const orderBy = buildOrderBy(inventoryItems, query.sortBy || 'id', query.sort)

    const conditions: ReturnType<typeof and>[] = [
      isNull(inventoryItems.deletedAt)
    ];

    if (query.categoryId) {
      conditions.push(eq(items.categoryId, +query.categoryId))
    }

    if (query.itemId) {
      conditions.push(eq(inventoryItems.itemId, +query.itemId))
    }

    if (query.ownerId) {
      conditions.push(eq(inventoryItems.ownerId, +query.ownerId))
    }

    if (query.keyword) {
      conditions.push(or(
        like(items.name, `%${query.keyword}%`),
        like(profiles.name, `%${query.keyword}%`),
        like(profiles.phone, `%${query.keyword}%`),
      ))
    }

    const [_inventoryItems, [meta]] = await Promise.all([
      db.select({
        ...inventoryItemColumns,
        item: {
          id: items.id,
          name: items.name,
          type: items.type,
        },
        owner: {
          id: users.id,
          name: profiles.name,
          phone: profiles.phone,
        },
        category: categoryColumns,
        unit: unitColumns,
      })
        .from(inventoryItems)
        .innerJoin(items, eq(items.id, inventoryItems.itemId))
        .innerJoin(categories, eq(categories.id, items.categoryId))
        .innerJoin(units, eq(units.id, items.unitId))
        .innerJoin(users, eq(users.id, inventoryItems.ownerId))
        .innerJoin(profiles, eq(profiles.userId, users.id))
        .where(and(...conditions))
        .orderBy(orderBy)
        .limit(Number(query.pageSize || 5))
        .offset(countOffset(query.page, query.pageSize)),
      db.select({
        count: count().mapWith(Number),
      }).from(inventoryItems)
        .innerJoin(items, eq(items.id, inventoryItems.itemId))
        .innerJoin(users, eq(users.id, inventoryItems.ownerId))
        .innerJoin(profiles, eq(profiles.userId, users.id))
        .where(and(...conditions))
    ])

    return [_inventoryItems, meta.count]
  }

  static async get(id: number): Promise<InventoryItem> {
    const [inventoryItem] = await db
      .select(inventoryItemColumns)
      .from(inventoryItems)
      .where(and(
        isNull(inventoryItems.deletedAt),
        eq(inventoryItems.id, id)
      ))
      .limit(1)

    if (!inventoryItem) {
      throw new NotFoundException(messages.errorNotFound(`Inventory item with ID ${id}`))
    }

    return inventoryItem;
  }

  static async create(payload: InventoryItemRequest): Promise<InventoryItem> {
    await ItemService.check(payload.itemId, ItemTypeEnum.Inventory);
    await UserService.check(payload.ownerId, [RoleEnum.Owner])

    const newInventoryItem = await db.transaction(async (transaction) => {
      const [_newInventoryItem] = await transaction
        .insert(inventoryItems)
        .values({
          itemId: payload.itemId,
          ownerId: payload.ownerId,
        })
        .returning(inventoryItemColumns)

      await transaction
        .insert(inventoryItemMutations)
        .values({
          inventoryItemId: _newInventoryItem.id,
          itemId: _newInventoryItem.itemId,
          quantity: payload.totalQuantity || 0,
          mutateAt: dayjs().unix(),
          description: ItemMutationDescriptionEnum.ItemCreation
        })

      return _newInventoryItem;
    })

    return newInventoryItem;
  }

  static async update(id: number, payload: InventoryItemRequest): Promise<InventoryItem> {
    await ItemService.check(payload.itemId, ItemTypeEnum.Inventory);
    await UserService.check(payload.ownerId, [RoleEnum.Owner])

    const updatedInventoryItem = await db.transaction(async (transaction) => {
      const [_updatedInventoryItem] = await db
        .update(inventoryItems)
        .set({
          itemId: payload.itemId,
          ownerId: payload.ownerId,
        })
        .where(and(
          isNull(inventoryItems.deletedAt),
          eq(inventoryItems.id, id)
        ))
        .returning(inventoryItemColumns)

      if (!_updatedInventoryItem) {
        throw new NotFoundException(messages.errorNotFound(`Inventory item with ID ${id}`))
      }

      if (_updatedInventoryItem.totalQuantity !== payload.totalQuantity) {
        await transaction
          .insert(inventoryItemMutations)
          .values({
            inventoryItemId: _updatedInventoryItem.id,
            itemId: _updatedInventoryItem.itemId,
            quantity: payload.totalQuantity || 0,
            mutateAt: dayjs().unix(),
            description: ItemMutationDescriptionEnum.ItemAdjusted
          })
      }


      return _updatedInventoryItem;
    })

    return updatedInventoryItem;
  }

  static async delete(id: number) {
    const [deletedInventoryItem] = await db
      .update(inventoryItems)
      .set({
        deletedAt: dayjs().unix(),
      })
      .where(and(
        isNull(inventoryItems.deletedAt),
        eq(inventoryItems.id, id)
      ))
      .returning(inventoryItemColumns)

    if (!deletedInventoryItem) {
      throw new NotFoundException(messages.errorNotFound(`Inventory item with ID ${id}`))
    }
  }

  static async check(id: number) {
    const [inventoryItem] = await db
      .select(inventoryItemColumns)
      .from(inventoryItems)
      .where(and(
        isNull(inventoryItems.deletedAt),
        eq(inventoryItems.id, id)
      ))

    if (!inventoryItem) {
      throw new NotFoundException(messages.errorConstraint(`invnetory item with ID ${id}`))
    }
  }

  private constructor() { }
}