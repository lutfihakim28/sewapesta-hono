import { buildOrderBy } from '@/lib/utils/build-order-by';
import { EquipmentItem, EquipmentItemFilter, EquipmentItemList, EquipmentItemRequest } from './EquipmentItem.schema';
import { equipmentItems } from 'db/schema/equipment-items';
import { and, count, eq, isNull, like, or } from 'drizzle-orm';
import { items } from 'db/schema/items';
import { profiles } from 'db/schema/profiles';
import { db } from 'db';
import { users } from 'db/schema/users';
import { countOffset } from '@/lib/utils/count-offset';
import { equipmentItemColumns } from './EquipmentItem.column';
import { itemColumns } from '../items/Item.column';
import { NotFoundException } from '@/lib/exceptions/NotFoundException';
import { messages } from '@/lib/constants/messages';
import { UserService } from '../users/User.service';
import { ItemService } from '../items/Item.service';
import { generateNumber } from '@/lib/utils/generate-number';
import { categories } from 'db/schema/categories';
import { units } from 'db/schema/units';
import { categoryColumns } from '../categories/Category.column';
import { unitColumns } from '../units/Unit.column';
import dayjs from 'dayjs';
import { ItemTypeEnum } from '@/lib/enums/ItemTypeEnum';

export class EquipmentItemService {
  static async list(query: EquipmentItemFilter): Promise<[EquipmentItemList, number]> {
    const orderBy = buildOrderBy(equipmentItems, query.sortBy || 'id', query.sort);

    const conditions: ReturnType<typeof and>[] = [
      isNull(equipmentItems.deletedAt),
    ]

    if (query.itemId) {
      conditions.push(eq(equipmentItems.itemId, +query.itemId))
    }

    if (query.ownerId) {
      conditions.push(eq(equipmentItems.ownerId, +query.ownerId))
    }

    if (query.status) {
      conditions.push(eq(equipmentItems.status, query.status))
    }

    if (query.number) {
      conditions.push(eq(equipmentItems.number, query.number))
    }

    if (query.keyword) {
      conditions.push(or(
        like(equipmentItems.number, `%${query.keyword}%`),
        like(items.name, `%${query.keyword}%`),
        like(profiles.name, `%${query.keyword}%`),
      ))
    }

    const [_equipmentItems, [meta]] = await Promise.all([
      db.select({
        ...equipmentItemColumns,
        item: itemColumns,
        category: categoryColumns,
        unit: unitColumns,
        owner: {
          id: users.id,
          name: profiles.name,
          phone: profiles.phone
        }
      })
        .from(equipmentItems)
        .innerJoin(items, eq(items.id, equipmentItems.itemId))
        .innerJoin(categories, eq(categories.id, items.categoryId))
        .innerJoin(units, eq(units.id, items.unitId))
        .innerJoin(users, eq(users.id, equipmentItems.ownerId))
        .innerJoin(profiles, eq(profiles.userId, users.id))
        .where(and(...conditions))
        .orderBy(orderBy)
        .limit(Number(query.pageSize || 5))
        .offset(countOffset(query.page, query.pageSize)),
      db.select({
        count: count().mapWith(Number),
      })
        .from(equipmentItems)
        .innerJoin(items, eq(items.id, equipmentItems.itemId))
        .innerJoin(categories, eq(categories.id, items.categoryId))
        .innerJoin(users, eq(users.id, equipmentItems.ownerId))
        .innerJoin(profiles, eq(profiles.userId, users.id))
        .where(and(...conditions))
    ])

    return [_equipmentItems, meta.count]
  }

  static async get(id: number): Promise<EquipmentItem> {
    const [equipmentItem] = await db.select(equipmentItemColumns)
      .from(equipmentItems)
      .where(and(
        isNull(equipmentItems.deletedAt),
        eq(equipmentItems.id, id)
      ))
      .limit(1)

    if (!equipmentItem) {
      throw new NotFoundException(messages.errorNotFound(`Equipment item with ID ${id}`))
    }

    return equipmentItem;
  }

  static async create(payload: EquipmentItemRequest): Promise<EquipmentItem> {
    await UserService.check(payload.ownerId)
    await ItemService.check(payload.itemId, ItemTypeEnum.Equipment)

    const newEquipmentItem = await db.transaction(async (transaction) => {
      const [_newEquipmentItem] = await transaction.insert(equipmentItems)
        .values({
          ...payload,
          number: '', // will update it below
        })
        .returning({
          id: equipmentItems.id
        })

      const [equipmentItem] = await transaction
        .update(equipmentItems)
        .set({
          number: generateNumber('EI', _newEquipmentItem.id)
        })
        .where(eq(equipmentItems.id, _newEquipmentItem.id))
        .returning(equipmentItemColumns)

      return equipmentItem
    })

    return newEquipmentItem;
  }

  static async update(id: number, payload: EquipmentItemRequest): Promise<EquipmentItem> {
    await UserService.check(payload.ownerId)
    await ItemService.check(payload.itemId)

    const [updatedEquipmentItem] = await db.update(equipmentItems)
      .set(payload)
      .where(and(
        isNull(equipmentItems.deletedAt),
        eq(equipmentItems.id, id)
      ))
      .returning(equipmentItemColumns)

    if (!updatedEquipmentItem) {
      throw new NotFoundException(messages.errorNotFound(`Equipment item with ID ${id}`))
    }

    return updatedEquipmentItem;
  }

  static async delete(id: number) {
    const [deletedEquipmentItem] = await db.update(equipmentItems)
      .set({
        deletedAt: dayjs().unix(),
      })
      .where(and(
        isNull(equipmentItems.deletedAt),
        eq(equipmentItems.id, id)
      ))
      .returning({ id: equipmentItems.id })

    if (!deletedEquipmentItem) {
      throw new NotFoundException(messages.errorNotFound(`Equipment item with ID ${id}`))
    }
  }

  private constructor() { }
}