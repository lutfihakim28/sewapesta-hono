import { ItemRevenueTerm, ItemRevenueTermColumn, ItemRevenueTermFilter, ItemRevenueTermList, ItemRevenueTermListColumn, ItemRevenueTermRequest, sortableItemRevenueTermColumns } from './ItemRevenueTerm.schema';
import { and, asc, count, desc, eq, isNull, like, or, SQL } from 'drizzle-orm';
import { users } from 'db/schema/users';
import { items } from 'db/schema/items';
import { profiles } from 'db/schema/profiles';
import { db } from 'db';
import { itemRevenueTermColumns } from './ItemRevenueTerm.column';
import { inventories } from 'db/schema/inventories';
import { countOffset } from '@/utils/helpers/count-offset';
import { NotFoundException } from '@/utils/exceptions/NotFoundException';
import { AppDate } from '@/utils/libs/AppDate';
import { itemRevenueTerms } from 'db/schema/item-revenue-terms';
import { ItemService } from '../items/Item.service';
import { UserService } from '../users/User.service';
import { RoleEnum } from '@/utils/enums/RoleEnum';

export class ItemRevenueTermService {
  static async list(query: ItemRevenueTermFilter): Promise<[ItemRevenueTermList, number]> {
    let orders: SQL<unknown>[] = [];

    const pushOrders = (
      cols: string | string[] | undefined,
      direction: 'asc' | 'desc'
    ) => {
      const targetCols = Array.isArray(cols) ? cols : [cols];
      const isAsc = direction === 'asc';
      const opposite = isAsc ? 'desc' : 'asc';

      targetCols.forEach((col) => {
        if (!sortableItemRevenueTermColumns.includes(col as ItemRevenueTermListColumn)) return;
        if ((query[opposite] as ItemRevenueTermListColumn[]).includes(col as ItemRevenueTermListColumn)) return;

        const orderFn = isAsc ? asc : desc;
        orders.push(orderFn(itemRevenueTerms[col as ItemRevenueTermColumn]));
      });
    };

    pushOrders(query.asc, 'asc');
    pushOrders(query.desc, 'desc');

    const conditions: ReturnType<typeof and>[] = [
      isNull(itemRevenueTerms.deletedAt),
    ];

    if (query.ownerId) {
      conditions.push(eq(users.id, +query.ownerId))
    }

    if (query.itemId) {
      conditions.push(eq(itemRevenueTerms.itemId, +query.itemId))
    }

    if (query.keyword) {
      conditions.push(or(
        like(items.name, `%${query.keyword}%`),
        like(profiles.name, `%${query.keyword}%`),
      ))
    }

    const [_itemRevenueTerms, [meta]] = await Promise.all([
      db.select({
        ...itemRevenueTermColumns,
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
        .from(itemRevenueTerms)
        .innerJoin(items, eq(items.id, itemRevenueTerms.itemId))
        .innerJoin(users, eq(users.id, inventories.ownerId))
        .innerJoin(profiles, eq(profiles.userId, users.id))
        .where(and(...conditions))
        .orderBy(...orders)
        .limit(Number(query.pageSize || 5))
        .offset(countOffset(query.page, query.pageSize)),
      db.select({
        count: count().mapWith(Number)
      })
        .from(itemRevenueTerms)
        .innerJoin(items, eq(items.id, itemRevenueTerms.itemId))
        .innerJoin(users, eq(users.id, inventories.ownerId))
        .innerJoin(profiles, eq(profiles.userId, users.id))
        .where(and(...conditions)),
    ])

    return [_itemRevenueTerms, meta.count]
  }

  static async get(id: number): Promise<ItemRevenueTerm> {
    const [inventoryUsage] = await db
      .select(itemRevenueTermColumns)
      .from(itemRevenueTerms)
      .where(and(
        isNull(itemRevenueTerms.deletedAt),
        eq(itemRevenueTerms.id, id)
      ))
      .limit(1);

    return inventoryUsage;
  }

  static async create(payload: ItemRevenueTermRequest): Promise<ItemRevenueTerm> {
    await Promise.all([
      ItemService.check(payload.itemId),
      UserService.check(payload.ownerId, [RoleEnum.Owner]),
    ])

    const [newUsage] = await db
      .insert(itemRevenueTerms)
      .values(payload)
      .returning(itemRevenueTermColumns)

    return newUsage;
  }

  static async update(id: number, payload: ItemRevenueTermRequest): Promise<ItemRevenueTerm> {
    await Promise.all([
      ItemService.check(payload.itemId),
      UserService.check(payload.ownerId, [RoleEnum.Owner]),
    ])

    const [updatedUsage] = await db
      .update(itemRevenueTerms)
      .set(payload)
      .where(and(
        isNull(inventories.deletedAt),
        eq(inventories.id, id),
      ))
      .returning(itemRevenueTermColumns)

    if (!updatedUsage) {
      throw new NotFoundException('itemRevenueTerm', id)
    }

    return updatedUsage;
  }

  static async delete(id: number): Promise<void> {
    const [deletedUsage] = await db
      .update(itemRevenueTerms)
      .set({
        deletedAt: new AppDate().unix()
      })
      .where(and(
        isNull(inventories.deletedAt),
        eq(inventories.id, id),
      ))
      .returning(itemRevenueTermColumns)

    if (!deletedUsage) {
      throw new NotFoundException('itemRevenueTerm', id)
    }
  }

  private constructor() { }
}