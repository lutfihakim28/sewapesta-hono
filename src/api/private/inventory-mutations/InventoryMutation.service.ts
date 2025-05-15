import { and, count, desc, eq, isNull, like, or } from 'drizzle-orm';
import { InventoryMutation, InventoryMutationFilter, InventoryMutationList, InventoryMutationRequest } from './InventoryMutation.schema';
import { inventoryMutations } from 'db/schema/inventory-mutations';
import { items } from 'db/schema/items';
import { profiles } from 'db/schema/profiles';
import { db } from 'db';
import { inventories } from 'db/schema/inventories';
import { users } from 'db/schema/users';
import { countOffset } from '@/lib/utils/count-offset';
import { inventoryMutationColumns } from './InventoryMutation.column';
import { NotFoundException } from '@/lib/exceptions/NotFoundException';
import { messages } from '@/lib/constants/messages';
import { InventoryService } from '../inventories/Inventory.service';
import dayjs from 'dayjs';

export class InventoryMutationService {
  static async list(query: InventoryMutationFilter): Promise<[InventoryMutationList, number]> {
    const conditions: ReturnType<typeof and>[] = [
      isNull(inventoryMutations.deletedAt),
    ];

    if (query.inventoryId) {
      conditions.push(eq(inventoryMutations.inventoryId, +query.inventoryId))
    }

    if (query.itemId) {
      conditions.push(eq(inventoryMutations.itemId, +query.itemId))
    }

    if (query.keyword) {
      conditions.push(or(
        like(items.name, `%${query.keyword}%`),
        like(profiles.name, `%${query.keyword}%`),
      ))
    }

    const [_inventoryMutations, [meta]] = await Promise.all([
      db.select({
        ...inventoryMutationColumns,
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
        .from(inventoryMutations)
        .innerJoin(items, eq(items.id, inventoryMutations.itemId))
        .innerJoin(inventories, eq(inventories.id, inventoryMutations.inventoryId))
        .innerJoin(users, eq(users.id, inventories.ownerId))
        .innerJoin(profiles, eq(profiles.userId, users.id))
        .where(and(...conditions))
        .orderBy(desc(inventoryMutations.mutateAt))
        .limit(Number(query.pageSize || 5))
        .offset(countOffset(query.page, query.pageSize)),
      db.select({
        count: count().mapWith(Number)
      })
        .from(inventoryMutations)
        .innerJoin(items, eq(items.id, inventoryMutations.itemId))
        .innerJoin(inventories, eq(inventories.id, inventoryMutations.inventoryId))
        .innerJoin(users, eq(users.id, inventories.ownerId))
        .innerJoin(profiles, eq(profiles.userId, users.id))
        .where(and(...conditions)),
    ])

    return [_inventoryMutations, meta.count]
  }

  static async get(id: number): Promise<InventoryMutation> {
    const [inventoryMutation] = await db
      .select(inventoryMutationColumns)
      .from(inventoryMutations)
      .where(and(
        isNull(inventoryMutations.deletedAt),
        eq(inventoryMutations.id, id)
      ))
      .limit(1);

    if (!inventoryMutation) {
      throw new NotFoundException(messages.errorNotFound(`Inventory item mutation with ID ${id}`))
    }

    return inventoryMutation;
  }

  static async create(payload: InventoryMutationRequest): Promise<InventoryMutation> {
    const inventory = await InventoryService.check(payload.inventoryId);

    const [newMutation] = await db
      .insert(inventoryMutations)
      .values({
        ...payload,
        itemId: inventory.itemId,
        mutateAt: dayjs().unix(),
      })
      .returning(inventoryMutationColumns)

    return newMutation;
  }

  static async update(id: number, payload: InventoryMutationRequest): Promise<InventoryMutation> {
    const inventory = await InventoryService.check(payload.inventoryId);

    const [updatedMutation] = await db
      .update(inventoryMutations)
      .set({
        ...payload,
        itemId: inventory.itemId,
      })
      .where(and(
        isNull(inventories.deletedAt),
        eq(inventories.id, id),
      ))
      .returning(inventoryMutationColumns)

    if (!updatedMutation) {
      throw new NotFoundException(messages.errorNotFound(`Inventory item mutation with ID ${id}`))
    }

    return updatedMutation;
  }

  static async delete(id: number): Promise<void> {
    const [deletedMutation] = await db
      .update(inventoryMutations)
      .set({
        deletedAt: dayjs().unix()
      })
      .where(and(
        isNull(inventories.deletedAt),
        eq(inventories.id, id),
      ))
      .returning(inventoryMutationColumns)

    if (!deletedMutation) {
      throw new NotFoundException(messages.errorNotFound(`Inventory item mutation with ID ${id}`))
    }
  }

  private constructor() { }
}