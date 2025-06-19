import { Equipment, EquipmentFilter, EquipmentList, EquipmentRequest, EquipmentColumn } from './Equipment.schema';
import { equipments } from 'db/schema/equipments';
import { and, asc, count, desc, eq, isNull, like, or } from 'drizzle-orm';
import { items } from 'db/schema/items';
import { profiles } from 'db/schema/profiles';
import { db } from 'db';
import { users } from 'db/schema/users';
import { countOffset } from '@/utils/helpers/count-offset';
import { equipmentColumns } from './Equipment.column';
import { itemColumns } from '../items/Item.column';
import { NotFoundException } from '@/utils/exceptions/NotFoundException';
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
import { ConstraintException } from '@/utils/exceptions/ConstraintException';
import { SortDirectionEnum } from '@/utils/enums/SortDirectionEnum';

export class EquipmentService {
  static async list(query: EquipmentFilter): Promise<[EquipmentList, number]> {
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

    const orderFn = query.sortDirection === SortDirectionEnum.Asc ? asc : desc;
    const sort = query.sort as EquipmentColumn || 'createdAt';
    const order = orderFn(equipments[sort]);

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
        .orderBy(order)
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

    return updatedEquipment;
  }

  static async delete(id: number) {
    const [deletedEquipment] = await db.update(equipments)
      .set({
        deletedAt: new AppDate().unix(),
      })
      .where(and(
        isNull(equipments.deletedAt),
        eq(equipments.id, id)
      ))
      .returning({ id: equipments.id })

    if (!deletedEquipment) {
      throw new NotFoundException('equipment', id)
    }
  }

  static async check(id: number): Promise<Equipment> {
    const [inventory] = await db
      .select(equipmentColumns)
      .from(equipments)
      .where(and(
        isNull(equipments.deletedAt),
        eq(equipments.id, id)
      ))

    if (!inventory) {
      throw new ConstraintException('equipment', id)
    }

    return inventory;
  }

  private constructor() { }
}