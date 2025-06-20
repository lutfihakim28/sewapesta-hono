import { Inventory, InventoryColumn, InventoryFilter, InventoryList, InventoryRequest } from './Inventory.schema';
import { inventories } from 'db/schema/inventories';
import { and, asc, count, desc, eq, isNull, like, or } from 'drizzle-orm';
import { items } from 'db/schema/items';
import { profiles } from 'db/schema/profiles';
import { db } from 'db';
import { users } from 'db/schema/users';
import { categories } from 'db/schema/categories';
import { units } from 'db/schema/units';
import { countOffset } from '@/utils/helpers/count-offset';
import { inventoryColumns } from './Inventory.column';
import { categoryColumns } from '../categories/Category.column';
import { unitColumns } from '../units/Unit.column';
import { NotFoundException } from '@/utils/exceptions/NotFoundException';
import { ItemService } from '../items/Item.service';
import { ItemTypeEnum } from '@/utils/enums/ItemTypeEnum';
import { UserService } from '../users/User.service';
import { RoleEnum } from '@/utils/enums/RoleEnum';
import { AppDate } from '@/utils/libs/AppDate';
import { ConstraintException } from '@/utils/exceptions/ConstraintException';
import { SortDirectionEnum } from '@/utils/enums/SortDirectionEnum';

export class InventoryService {
  static async list(query: InventoryFilter): Promise<[InventoryList, number]> {
    const conditions: ReturnType<typeof and>[] = [
      isNull(inventories.deletedAt)
    ];

    if (query.categoryId) {
      conditions.push(eq(items.categoryId, +query.categoryId))
    }

    if (query.itemId) {
      conditions.push(eq(inventories.itemId, +query.itemId))
    }

    if (query.ownerId) {
      conditions.push(eq(inventories.ownerId, +query.ownerId))
    }

    if (query.keyword) {
      conditions.push(or(
        like(items.name, `%${query.keyword}%`),
        like(profiles.name, `%${query.keyword}%`),
        like(profiles.phone, `%${query.keyword}%`),
      ))
    }

    const orderFn = query.sortDirection === SortDirectionEnum.Asc ? asc : desc;
    const sort = query.sort as InventoryColumn || 'createdAt';
    const order = orderFn(inventories[sort]);

    const [_inventories, [meta]] = await Promise.all([
      db.select({
        ...inventoryColumns,
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
        .from(inventories)
        .innerJoin(items, eq(items.id, inventories.itemId))
        .innerJoin(categories, eq(categories.id, items.categoryId))
        .innerJoin(units, eq(units.id, items.unitId))
        .innerJoin(users, eq(users.id, inventories.ownerId))
        .innerJoin(profiles, eq(profiles.userId, users.id))
        .where(and(...conditions))
        .orderBy(order)
        .limit(Number(query.pageSize || 5))
        .offset(countOffset(query.page, query.pageSize)),
      db.select({
        count: count().mapWith(Number),
      }).from(inventories)
        .innerJoin(items, eq(items.id, inventories.itemId))
        .innerJoin(users, eq(users.id, inventories.ownerId))
        .innerJoin(profiles, eq(profiles.userId, users.id))
        .where(and(...conditions))
    ])

    return [_inventories, meta.count]
  }

  static async get(id: number): Promise<Inventory> {
    const [inventory] = await db
      .select(inventoryColumns)
      .from(inventories)
      .where(and(
        isNull(inventories.deletedAt),
        eq(inventories.id, id)
      ))
      .limit(1)

    return inventory;
  }

  static async create(payload: InventoryRequest): Promise<Inventory> {
    await ItemService.check(payload.itemId, ItemTypeEnum.Inventory);
    await UserService.check(payload.ownerId, [RoleEnum.Owner])

    const [newInventory] = await db.insert(inventories)
      .values({
        itemId: payload.itemId,
        ownerId: payload.ownerId,
      })
      .returning(inventoryColumns)

    return newInventory;
  }

  static async update(id: number, payload: InventoryRequest): Promise<Inventory> {
    await ItemService.check(payload.itemId, ItemTypeEnum.Inventory);
    await UserService.check(payload.ownerId, [RoleEnum.Owner])

    const [updatedInventory] = await db
      .update(inventories)
      .set({
        itemId: payload.itemId,
        ownerId: payload.ownerId,
      })
      .where(and(
        isNull(inventories.deletedAt),
        eq(inventories.id, id)
      ))
      .returning(inventoryColumns)

    return updatedInventory;
  }

  static async delete(id: number) {
    const [deletedInventory] = await db
      .update(inventories)
      .set({
        deletedAt: new AppDate().unix(),
      })
      .where(and(
        isNull(inventories.deletedAt),
        eq(inventories.id, id)
      ))
      .returning(inventoryColumns)

    if (!deletedInventory) {
      throw new NotFoundException('inventory', id)
    }
  }

  static async check(id: number): Promise<Inventory> {
    const [inventory] = await db
      .select(inventoryColumns)
      .from(inventories)
      .where(and(
        isNull(inventories.deletedAt),
        eq(inventories.id, id)
      ))

    if (!inventory) {
      throw new ConstraintException('inventory', id)
    }

    return inventory;
  }

  private constructor() { }
}