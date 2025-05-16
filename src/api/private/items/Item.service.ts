import { Item, ItemColumn, ItemFilter, ItemListColumn, ItemRequest, sortableItemColumns } from './Item.schema';
import { items } from 'db/schema/items';
import { and, asc, count, desc, eq, isNull, like, SQL } from 'drizzle-orm';
import { db } from 'db';
import { itemColumns } from './Item.column';
import { categories } from 'db/schema/categories';
import { units } from 'db/schema/units';
import { countOffset } from '@/utils/helpers/count-offset';
import { categoryColumns } from '../categories/Category.column';
import { unitColumns } from '../units/Unit.column';
import { NotFoundException } from '@/utils/exceptions/NotFoundException';
import { messages } from '@/utils/constants/messages';
import { CategoryService } from '../categories/Category.service';
import { UnitService } from '../units/Unit.service';
import dayjs from 'dayjs';
import { ItemTypeEnum } from '@/utils/enums/ItemTypeEnum';

export class ItemService {
  static async list(query: ItemFilter): Promise<[Item[], number]> {
    let orders: SQL<unknown>[] = [];

    query.asc.forEach((col) => {
      if (!sortableItemColumns.includes(col as ItemListColumn)) return;
      if (query.desc.includes(col as ItemListColumn)) return;

      orders.push(asc(items[col as ItemColumn]))
    })

    query.desc.forEach((col) => {
      if (!sortableItemColumns.includes(col as ItemListColumn)) return;
      if (query.asc.includes(col as ItemListColumn)) return;

      orders.push(desc(items[col as ItemColumn]))
    })

    const conditions: ReturnType<typeof and>[] = [
      isNull(items.deletedAt)
    ];

    if (query.categoryId) {
      conditions.push(eq(items.categoryId, +query.categoryId))
    }

    if (query.type) {
      conditions.push(eq(items.type, query.type))
    }

    if (query.keyword) {
      conditions.push(like(items.name, `%${query.keyword}%`))
    }

    const [_items, [meta]] = await Promise.all([
      db.select({
        ...itemColumns,
        category: categoryColumns,
        unit: unitColumns,
      })
        .from(items)
        .innerJoin(categories, eq(categories.id, items.categoryId))
        .innerJoin(units, eq(units.id, items.unitId))
        .where(and(...conditions))
        .orderBy(...orders)
        .limit(Number(query.pageSize || 5))
        .offset(countOffset(query.page, query.pageSize)),
      db.select({
        count: count().mapWith(Number),
      })
        .from(items)
        .where(and(...conditions))
    ])

    return [_items, meta.count]
  }

  static async get(id: number) {
    const [item] = await db
      .select({
        ...itemColumns,
        category: categoryColumns,
        unit: unitColumns,
      })
      .from(items)
      .innerJoin(categories, eq(categories.id, items.categoryId))
      .innerJoin(units, eq(units.id, items.unitId))
      .where(and(
        isNull(items.deletedAt),
        eq(items.id, id)
      ))
      .limit(1)

    if (!item) {
      throw new NotFoundException(messages.errorNotFound(`Item with ID ${id}`))
    }

    return item;
  }

  static async create(payload: ItemRequest): Promise<Item> {
    await CategoryService.check(payload.categoryId);
    await UnitService.check(payload.unitId);

    const [newItem] = await db
      .insert(items)
      .values(payload)
      .returning({
        id: items.id
      })

    const item = await this.get(newItem.id);

    return item;
  }

  static async update(id: number, payload: ItemRequest): Promise<Item> {
    await CategoryService.check(payload.categoryId);
    await UnitService.check(payload.unitId);

    const [updatedItem] = await db
      .update(items)
      .set(payload)
      .where(and(
        isNull(items.deletedAt),
        eq(items.id, id)
      ))
      .returning({
        id: items.id
      })

    if (!updatedItem) {
      throw new NotFoundException(messages.errorNotFound(`Item with ID ${id}`))
    }

    const item = await this.get(updatedItem.id);

    return item;
  }

  static async delete(id: number) {
    const [deletedItem] = await db
      .update(items)
      .set({
        deletedAt: dayjs().unix(),
      })
      .returning({
        id: items.id
      })

    if (!deletedItem) {
      throw new NotFoundException(messages.errorNotFound(`Item with ID ${id}`))
    }
  }

  static async check(id: number, type?: ItemTypeEnum) {
    const conditions = [
      isNull(items.deletedAt),
      eq(items.id, id)
    ]
    if (type) {
      conditions.push(eq(items.type, type))
    }

    const [item] = await db
      .select(itemColumns)
      .from(items)
      .where(and(
        ...conditions
      ))
      .limit(1)

    if (!item && !type) {
      throw new NotFoundException(messages.errorConstraint(`item with ID ${id}`))
    }

    if (!item && type) {
      throw new NotFoundException(`Selected item with ID ${id} is not ${type} type.`)
    }
  }

  private constructor() { };
}