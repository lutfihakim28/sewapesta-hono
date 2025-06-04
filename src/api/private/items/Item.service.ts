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
import { CategoryService } from '../categories/Category.service';
import { UnitService } from '../units/Unit.service';
import { ItemTypeEnum } from '@/utils/enums/ItemTypeEnum';
import { AppDate } from '@/utils/libs/AppDate';
import { ItemTypeUnmatchException } from '@/utils/exceptions/ItemTypeUnmatchException';

export class ItemService {
  static async list(query: ItemFilter): Promise<[Item[], number]> {
    let orders: SQL<unknown>[] = [];

    const pushOrders = (
      cols: string | string[] | undefined,
      direction: 'asc' | 'desc'
    ) => {
      const targetCols = Array.isArray(cols) ? cols : [cols];
      const isAsc = direction === 'asc';
      const opposite = isAsc ? 'desc' : 'asc';

      targetCols.forEach((col) => {
        if (!sortableItemColumns.includes(col as ItemListColumn)) return;
        if ((query[opposite] as ItemListColumn[]).includes(col as ItemListColumn)) return;

        const orderFn = isAsc ? asc : desc;
        orders.push(orderFn(items[col as ItemColumn]));
      });
    };

    pushOrders(query.asc, 'asc');
    pushOrders(query.desc, 'desc');

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

    return item;
  }

  static async create(payload: ItemRequest): Promise<Item> {
    await Promise.all([
      CategoryService.check(payload.categoryId),
      UnitService.check(payload.unitId),
    ])

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
    await Promise.all([
      CategoryService.check(payload.categoryId),
      UnitService.check(payload.unitId),
    ])

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
      throw new NotFoundException('item', id)
    }

    const item = await this.get(updatedItem.id);

    return item;
  }

  static async delete(id: number) {
    const [deletedItem] = await db
      .update(items)
      .set({
        deletedAt: new AppDate().unix(),
      })
      .returning({
        id: items.id
      })

    if (!deletedItem) {
      throw new NotFoundException('item', id)
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
      throw new NotFoundException('item', id)
    }

    if (!item && type) {
      throw new ItemTypeUnmatchException(id, type);
    }
  }

  private constructor() { };
}