import { Equipment, EquipmentListColumn, EquipmentFilter, EquipmentList, EquipmentRequest, sortableEquipmentColumns, EquipmentColumn } from './Equipment.schema';
import { equipments } from 'db/schema/equipments';
import { and, asc, count, desc, eq, isNull, like, or, SQL } from 'drizzle-orm';
import { items } from 'db/schema/items';
import { profiles } from 'db/schema/profiles';
import { db } from 'db';
import { users } from 'db/schema/users';
import { countOffset } from '@/utils/helpers/count-offset';
import { equipmentColumns } from './Equipment.column';
import { itemColumns } from '../items/Item.column';
import { NotFoundException } from '@/utils/exceptions/NotFoundException';
import { messages } from '@/utils/constants/messages';
import { UserService } from '../users/User.service';
import { ItemService } from '../items/Item.service';
import { generateNumber } from '@/utils/helpers/generate-number';
import { categories } from 'db/schema/categories';
import { units } from 'db/schema/units';
import { categoryColumns } from '../categories/Category.column';
import { unitColumns } from '../units/Unit.column';
import { ItemTypeEnum } from '@/utils/enums/ItemTypeEnum';
import { RoleEnum } from '@/utils/enums/RoleEnum';
import { AppDate } from '@/utils/libs/AppDate';

export class EquipmentService {
  static async list(query: EquipmentFilter): Promise<[EquipmentList, number]> {
    let orders: SQL<unknown>[] = [];

    query.asc.forEach((col) => {
      if (!sortableEquipmentColumns.includes(col as EquipmentListColumn)) return;
      if (query.desc.includes(col as EquipmentListColumn)) return;
      if (col === 'item') {
        orders.push(asc(items.name))
        return;
      }
      if (col === 'owner') {
        orders.push(asc(profiles.name))
        return;
      }
      orders.push(asc(equipments[col as EquipmentColumn]))
    })

    query.desc.forEach((col) => {
      if (!sortableEquipmentColumns.includes(col as EquipmentListColumn)) return;
      if (query.asc.includes(col as EquipmentListColumn)) return;
      if (col === 'item') {
        orders.push(desc(items.name))
        return;
      }
      if (col === 'owner') {
        orders.push(desc(profiles.name))
        return;
      }
      orders.push(desc(equipments[col as EquipmentColumn]))
    })

    const conditions: ReturnType<typeof and>[] = [
      isNull(equipments.deletedAt),
    ]

    if (query.itemId) {
      conditions.push(eq(equipments.itemId, +query.itemId))
    }

    if (query.ownerId) {
      conditions.push(eq(equipments.ownerId, +query.ownerId))
    }

    if (query.status) {
      conditions.push(eq(equipments.status, query.status))
    }

    if (query.number) {
      conditions.push(eq(equipments.number, query.number))
    }

    if (query.keyword) {
      conditions.push(or(
        like(equipments.number, `%${query.keyword}%`),
        like(items.name, `%${query.keyword}%`),
        like(profiles.name, `%${query.keyword}%`),
      ))
    }

    const [_equipments, [meta]] = await Promise.all([
      db.select({
        ...equipmentColumns,
        item: itemColumns,
        category: categoryColumns,
        unit: unitColumns,
        owner: {
          id: users.id,
          name: profiles.name,
          phone: profiles.phone
        }
      })
        .from(equipments)
        .innerJoin(items, eq(items.id, equipments.itemId))
        .innerJoin(categories, eq(categories.id, items.categoryId))
        .innerJoin(units, eq(units.id, items.unitId))
        .innerJoin(users, eq(users.id, equipments.ownerId))
        .innerJoin(profiles, eq(profiles.userId, users.id))
        .where(and(...conditions))
        .orderBy(...orders)
        .limit(Number(query.pageSize || 5))
        .offset(countOffset(query.page, query.pageSize)),
      db.select({
        count: count().mapWith(Number),
      })
        .from(equipments)
        .innerJoin(items, eq(items.id, equipments.itemId))
        .innerJoin(categories, eq(categories.id, items.categoryId))
        .innerJoin(users, eq(users.id, equipments.ownerId))
        .innerJoin(profiles, eq(profiles.userId, users.id))
        .where(and(...conditions))
    ])

    return [_equipments, meta.count]
  }

  static async get(id: number): Promise<Equipment> {
    const [equipment] = await db.select(equipmentColumns)
      .from(equipments)
      .where(and(
        isNull(equipments.deletedAt),
        eq(equipments.id, id)
      ))
      .limit(1)

    if (!equipment) {
      throw new NotFoundException(messages.errorNotFound(`Equipment item with ID ${id}`))
    }

    return equipment;
  }

  static async create(payload: EquipmentRequest): Promise<Equipment> {
    await UserService.check(payload.ownerId, [RoleEnum.Owner])
    await ItemService.check(payload.itemId, ItemTypeEnum.Equipment)

    const newEquipment = await db.transaction(async (transaction) => {
      const [_newEquipment] = await transaction.insert(equipments)
        .values({
          ...payload,
          number: '', // will update it below
        })
        .returning({
          id: equipments.id
        })

      const [equipment] = await transaction
        .update(equipments)
        .set({
          number: generateNumber('EI', _newEquipment.id)
        })
        .where(eq(equipments.id, _newEquipment.id))
        .returning(equipmentColumns)

      return equipment
    })

    return newEquipment;
  }

  static async update(id: number, payload: EquipmentRequest): Promise<Equipment> {
    await UserService.check(payload.ownerId, [RoleEnum.Owner])
    await ItemService.check(payload.itemId)

    const [updatedEquipment] = await db.update(equipments)
      .set(payload)
      .where(and(
        isNull(equipments.deletedAt),
        eq(equipments.id, id)
      ))
      .returning(equipmentColumns)

    if (!updatedEquipment) {
      throw new NotFoundException(messages.errorNotFound(`Equipment item with ID ${id}`))
    }

    return updatedEquipment;
  }

  static async delete(id: number) {
    const [deletedEquipment] = await db.update(equipments)
      .set({
        deletedAt: new AppDate().unix,
      })
      .where(and(
        isNull(equipments.deletedAt),
        eq(equipments.id, id)
      ))
      .returning({ id: equipments.id })

    if (!deletedEquipment) {
      throw new NotFoundException(messages.errorNotFound(`Equipment item with ID ${id}`))
    }
  }

  private constructor() { }
}