import { inventoryUsages } from 'db/schema/inventory-usages';
import { InventoryUsage, InventoryUsageFilter, InventoryUsageList, InventoryUsageRequest } from './InventoryUsage.schema';
import { and, between, count, desc, eq, gte, isNull, like, lte, or } from 'drizzle-orm';
import { users } from 'db/schema/users';
import { items } from 'db/schema/items';
import { profiles } from 'db/schema/profiles';
import { db } from 'db';
import { inventoryUsageColumns } from './InventoryUsage.column';
import { inventories } from 'db/schema/inventories';
import { countOffset } from '@/lib/utils/count-offset';
import { NotFoundException } from '@/lib/exceptions/NotFoundException';
import { messages } from '@/lib/constants/messages';
import { InventoryService } from '../inventories/Inventory.service';
import dayjs from 'dayjs';

export class InventoryUsageService {
  static async list(query: InventoryUsageFilter): Promise<[InventoryUsageList, number]> {
    const conditions: ReturnType<typeof and>[] = [
      isNull(inventoryUsages.deletedAt),
    ];

    if (query.ownerId) {
      conditions.push(eq(users.id, +query.ownerId))
    }

    if (query.itemId) {
      conditions.push(eq(inventoryUsages.itemId, +query.itemId))
    }

    if (query.keyword) {
      conditions.push(or(
        like(items.name, `%${query.keyword}%`),
        like(profiles.name, `%${query.keyword}%`),
      ))
    }

    if (query.from && query.to) {
      conditions.push(between(inventoryUsages.usedAt, Math.min(+query.from, +query.to), Math.max(+query.from, +query.to)))
    } else if (query.from) {
      conditions.push(gte(inventoryUsages.usedAt, +query.from))
    } else if (query.to) {
      conditions.push(lte(inventoryUsages.usedAt, +query.to))
    }

    const [_inventoryUsages, [meta]] = await Promise.all([
      db.select({
        ...inventoryUsageColumns,
        owner: {
          id: users.id,
          name: profiles.name,
          phone: profiles.phone,
        },
        item: {
          id: items.id,
          name: items.name,
        }
      })
        .from(inventoryUsages)
        .innerJoin(items, eq(items.id, inventoryUsages.itemId))
        .innerJoin(inventories, eq(inventories.id, inventoryUsages.inventoryId))
        .innerJoin(users, eq(users.id, inventories.ownerId))
        .innerJoin(profiles, eq(profiles.userId, users.id))
        .where(and(...conditions))
        .orderBy(desc(inventoryUsages.usedAt))
        .limit(Number(query.pageSize || 5))
        .offset(countOffset(query.page, query.pageSize)),
      db.select({
        count: count().mapWith(Number)
      })
        .from(inventoryUsages)
        .innerJoin(items, eq(items.id, inventoryUsages.itemId))
        .innerJoin(inventories, eq(inventories.id, inventoryUsages.inventoryId))
        .innerJoin(users, eq(users.id, inventories.ownerId))
        .innerJoin(profiles, eq(profiles.userId, users.id))
        .where(and(...conditions)),
    ])

    return [_inventoryUsages, meta.count]
  }

  static async get(id: number): Promise<InventoryUsage> {
    const [inventoryUsage] = await db
      .select(inventoryUsageColumns)
      .from(inventoryUsages)
      .where(and(
        isNull(inventoryUsages.deletedAt),
        eq(inventoryUsages.id, id)
      ))
      .limit(1);

    if (!inventoryUsage) {
      throw new NotFoundException(messages.errorNotFound(`Inventory item usage with ID ${id}`))
    }

    return inventoryUsage;
  }

  static async create(payload: InventoryUsageRequest): Promise<InventoryUsage> {
    const inventory = await InventoryService.check(payload.inventoryId);

    const [newUsage] = await db
      .insert(inventoryUsages)
      .values({
        ...payload,
        itemId: inventory.itemId,
      })
      .returning(inventoryUsageColumns)

    return newUsage;
  }

  static async update(id: number, payload: InventoryUsageRequest): Promise<InventoryUsage> {
    const inventory = await InventoryService.check(payload.inventoryId);

    const [updatedUsage] = await db
      .update(inventoryUsages)
      .set({
        ...payload,
        itemId: inventory.itemId,
      })
      .where(and(
        isNull(inventories.deletedAt),
        eq(inventories.id, id),
      ))
      .returning(inventoryUsageColumns)

    if (!updatedUsage) {
      throw new NotFoundException(messages.errorNotFound(`Inventory item usage with ID ${id}`))
    }

    return updatedUsage;
  }

  static async delete(id: number): Promise<void> {
    const [deletedUsage] = await db
      .update(inventoryUsages)
      .set({
        deletedAt: dayjs().unix()
      })
      .where(and(
        isNull(inventories.deletedAt),
        eq(inventories.id, id),
      ))
      .returning(inventoryUsageColumns)

    if (!deletedUsage) {
      throw new NotFoundException(messages.errorNotFound(`Inventory item usage with ID ${id}`))
    }
  }

  private constructor() { }
}