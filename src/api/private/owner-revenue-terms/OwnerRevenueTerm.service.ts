import { OwnerRevenueTerm, OwnerRevenueTermColumn, OwnerRevenueTermFilter, OwnerRevenueTermList, OwnerRevenueTermListColumn, OwnerRevenueTermRequest, sortableOwnerRevenueTermColumns } from './OwnerRevenueTerm.schema';
import { and, asc, count, desc, eq, isNull, like, SQL } from 'drizzle-orm';
import { users } from 'db/schema/users';
import { profiles } from 'db/schema/profiles';
import { db } from 'db';
import { ownerRevenueTermColumns } from './OwnerRevenueTerm.column';
import { inventories } from 'db/schema/inventories';
import { countOffset } from '@/utils/helpers/count-offset';
import { NotFoundException } from '@/utils/exceptions/NotFoundException';
import { AppDate } from '@/utils/libs/AppDate';
import { ownerRevenueTerms } from 'db/schema/owner-revenue-terms';
import { UserService } from '../users/User.service';
import { RoleEnum } from '@/utils/enums/RoleEnum';

export class OwnerRevenueTermService {
  static async list(query: OwnerRevenueTermFilter): Promise<[OwnerRevenueTermList, number]> {
    let orders: SQL<unknown>[] = [];

    const pushOrders = (
      cols: string | string[] | undefined,
      direction: 'asc' | 'desc'
    ) => {
      const targetCols = Array.isArray(cols) ? cols : [cols];
      const isAsc = direction === 'asc';
      const opposite = isAsc ? 'desc' : 'asc';

      targetCols.forEach((col) => {
        if (!sortableOwnerRevenueTermColumns.includes(col as OwnerRevenueTermListColumn)) return;
        if ((query[opposite] as OwnerRevenueTermListColumn[]).includes(col as OwnerRevenueTermListColumn)) return;

        const orderFn = isAsc ? asc : desc;
        orders.push(orderFn(ownerRevenueTerms[col as OwnerRevenueTermColumn]));
      });
    };

    pushOrders(query.asc, 'asc');
    pushOrders(query.desc, 'desc');

    const conditions: ReturnType<typeof and>[] = [
      isNull(ownerRevenueTerms.deletedAt),
    ];

    if (query.ownerId) {
      conditions.push(eq(users.id, +query.ownerId))
    }

    if (query.keyword) {
      conditions.push(like(profiles.name, `%${query.keyword}%`))
    }

    const [_ownerRevenueTerms, [meta]] = await Promise.all([
      db.select({
        ...ownerRevenueTermColumns,
        owner: {
          id: users.id,
          name: profiles.name,
          phone: profiles.phone,
        },
      })
        .from(ownerRevenueTerms)
        .innerJoin(users, eq(users.id, inventories.ownerId))
        .innerJoin(profiles, eq(profiles.userId, users.id))
        .where(and(...conditions))
        .orderBy(...orders)
        .limit(Number(query.pageSize || 5))
        .offset(countOffset(query.page, query.pageSize)),
      db.select({
        count: count().mapWith(Number)
      })
        .from(ownerRevenueTerms)
        .innerJoin(users, eq(users.id, inventories.ownerId))
        .innerJoin(profiles, eq(profiles.userId, users.id))
        .where(and(...conditions)),
    ])

    return [_ownerRevenueTerms, meta.count]
  }

  static async get(id: number): Promise<OwnerRevenueTerm> {
    const [inventoryUsage] = await db
      .select(ownerRevenueTermColumns)
      .from(ownerRevenueTerms)
      .where(and(
        isNull(ownerRevenueTerms.deletedAt),
        eq(ownerRevenueTerms.id, id)
      ))
      .limit(1);

    return inventoryUsage;
  }

  static async create(payload: OwnerRevenueTermRequest): Promise<OwnerRevenueTerm> {
    await UserService.check(payload.ownerId, [RoleEnum.Owner]);

    const [newUsage] = await db
      .insert(ownerRevenueTerms)
      .values(payload)
      .returning(ownerRevenueTermColumns)

    return newUsage;
  }

  static async update(id: number, payload: OwnerRevenueTermRequest): Promise<OwnerRevenueTerm> {
    await UserService.check(payload.ownerId, [RoleEnum.Owner]);

    const [updatedUsage] = await db
      .update(ownerRevenueTerms)
      .set(payload)
      .where(and(
        isNull(inventories.deletedAt),
        eq(inventories.id, id),
      ))
      .returning(ownerRevenueTermColumns)

    if (!updatedUsage) {
      throw new NotFoundException('ownerRevenueTerm', id)
    }

    return updatedUsage;
  }

  static async delete(id: number): Promise<void> {
    const [deletedUsage] = await db
      .update(ownerRevenueTerms)
      .set({
        deletedAt: new AppDate().unix()
      })
      .where(and(
        isNull(inventories.deletedAt),
        eq(inventories.id, id),
      ))
      .returning(ownerRevenueTermColumns)

    if (!deletedUsage) {
      throw new NotFoundException('ownerRevenueTerm', id)
    }
  }

  private constructor() { }
}