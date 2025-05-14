import { and, count, desc, eq, isNull, like, or } from 'drizzle-orm';
import { InventoryItemMutation, InventoryItemMutationFilter, InventoryItemMutationList, InventoryItemMutationRequest } from './InventoryItemMutation.schema';
import { inventoryItemMutations } from 'db/schema/inventory-item-mutations';
import { items } from 'db/schema/items';
import { profiles } from 'db/schema/profiles';
import { db } from 'db';
import { inventoryItems } from 'db/schema/inventory-items';
import { users } from 'db/schema/users';
import { countOffset } from '@/lib/utils/count-offset';
import { inventoryItemMutationColumns } from './InventoryItemMutation.column';
import { NotFoundException } from '@/lib/exceptions/NotFoundException';
import { messages } from '@/lib/constants/messages';
import { InventoryItemService } from '../inventory-items/InventoryItem.service';
import dayjs from 'dayjs';

export class InventoryItemMutationService {
  static async list(query: InventoryItemMutationFilter): Promise<[InventoryItemMutationList, number]> {
    const conditions: ReturnType<typeof and>[] = [
      isNull(inventoryItemMutations.deletedAt),
    ];

    if (query.inventoryItemId) {
      conditions.push(eq(inventoryItemMutations.inventoryItemId, +query.inventoryItemId))
    }

    if (query.itemId) {
      conditions.push(eq(inventoryItemMutations.itemId, +query.itemId))
    }

    if (query.keyword) {
      conditions.push(or(
        like(items.name, `%${query.keyword}%`),
        like(profiles.name, `%${query.keyword}%`),
      ))
    }

    const [_inventoryItemMutations, [meta]] = await Promise.all([
      db.select({
        ...inventoryItemMutationColumns,
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
        .from(inventoryItemMutations)
        .innerJoin(items, eq(items.id, inventoryItemMutations.itemId))
        .innerJoin(inventoryItems, eq(inventoryItems.id, inventoryItemMutations.inventoryItemId))
        .innerJoin(users, eq(users.id, inventoryItems.ownerId))
        .innerJoin(profiles, eq(profiles.userId, users.id))
        .where(and(...conditions))
        .orderBy(desc(inventoryItemMutations.mutateAt))
        .limit(Number(query.pageSize || 5))
        .offset(countOffset(query.page, query.pageSize)),
      db.select({
        count: count().mapWith(Number)
      })
        .from(inventoryItemMutations)
        .innerJoin(items, eq(items.id, inventoryItemMutations.itemId))
        .innerJoin(inventoryItems, eq(inventoryItems.id, inventoryItemMutations.inventoryItemId))
        .innerJoin(users, eq(users.id, inventoryItems.ownerId))
        .innerJoin(profiles, eq(profiles.userId, users.id))
        .where(and(...conditions)),
    ])

    return [_inventoryItemMutations, meta.count]
  }

  static async get(id: number): Promise<InventoryItemMutation> {
    const [inventoryItemMutation] = await db
      .select(inventoryItemMutationColumns)
      .from(inventoryItemMutations)
      .where(and(
        isNull(inventoryItemMutations.deletedAt),
        eq(inventoryItemMutations.id, id)
      ))
      .limit(1);

    if (!inventoryItemMutation) {
      throw new NotFoundException(messages.errorNotFound(`Inventory item mutation with ID ${id}`))
    }

    return inventoryItemMutation;
  }

  static async create(payload: InventoryItemMutationRequest): Promise<InventoryItemMutation> {
    const inventoryItem = await InventoryItemService.check(payload.inventoryItemId);

    const [newMutation] = await db
      .insert(inventoryItemMutations)
      .values({
        ...payload,
        itemId: inventoryItem.itemId,
        mutateAt: dayjs().unix(),
      })
      .returning(inventoryItemMutationColumns)

    return newMutation;
  }

  static async update(id: number, payload: InventoryItemMutationRequest): Promise<InventoryItemMutation> {
    const inventoryItem = await InventoryItemService.check(payload.inventoryItemId);

    const [updatedMutation] = await db
      .update(inventoryItemMutations)
      .set({
        ...payload,
        itemId: inventoryItem.itemId,
      })
      .where(and(
        isNull(inventoryItems.deletedAt),
        eq(inventoryItems.id, id),
      ))
      .returning(inventoryItemMutationColumns)

    if (!updatedMutation) {
      throw new NotFoundException(messages.errorNotFound(`Inventory item mutation with ID ${id}`))
    }

    return updatedMutation;
  }

  static async delete(id: number): Promise<void> {
    const [deletedMutation] = await db
      .update(inventoryItemMutations)
      .set({
        deletedAt: dayjs().unix()
      })
      .where(and(
        isNull(inventoryItems.deletedAt),
        eq(inventoryItems.id, id),
      ))
      .returning(inventoryItemMutationColumns)

    if (!deletedMutation) {
      throw new NotFoundException(messages.errorNotFound(`Inventory item mutation with ID ${id}`))
    }
  }

  private constructor() { }
}