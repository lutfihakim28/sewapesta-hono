import { SortEnum } from '@/lib/enums/SortEnum';
import { ItemMutationColumn, ItemMutationExtended, ItemMutationFilter } from './ItemMutation.schema';
import { and, asc, count, desc, eq, gte, isNull, like, lte, not } from 'drizzle-orm';
import { itemMutations } from 'db/schema/item-mutations';
import { RoleEnum } from '@/lib/enums/RoleEnum';
import { User } from '../users/User.schema';
import { users } from 'db/schema/users';
import { items } from 'db/schema/items';
import dayjs from 'dayjs';
import { db } from 'db';
import { itemMutationsColumns } from './ItemMutation.column';
import { profiles } from 'db/schema/profiles';
import { countOffset } from '@/lib/utils/count-offset';
import { itemColumns } from '../items/Item.column';
import { profileColumns } from '../users/User.column';

export abstract class ItemMutationService {
  static async list(query: ItemMutationFilter, user: User): Promise<[ItemMutationExtended[], number]> {
    let sort: SortEnum = SortEnum.Ascending;
    let sortBy: ItemMutationColumn = 'id';

    if (query.sort) {
      sort = query.sort
    }

    if (query.sortBy) {
      sortBy = query.sortBy
    }

    const orderBy = sort === SortEnum.Ascending
      ? asc(itemMutations[sortBy])
      : desc(itemMutations[sortBy])

    const conditions = this.buildWhereClause(query, user);

    const result = await Promise.all([
      db
        .select({
          ...itemMutationsColumns,
          item: itemColumns,
          owner: profileColumns
        })
        .from(itemMutations)
        .innerJoin(items, eq(items.id, itemMutations.itemId))
        .innerJoin(users, eq(users.id, items.ownerId))
        .innerJoin(profiles, eq(profiles.userId, users.id))
        .where(conditions)
        .orderBy(orderBy)
        .limit(Number(query.pageSize || 5))
        .offset(countOffset(query.page, query.pageSize)),
      this.count(query, user),
    ])

    return result;
  }

  private static async count(query: ItemMutationFilter, user: User): Promise<number> {
    const conditions = this.buildWhereClause(query, user);

    const [mutation] = await db
      .select({
        count: count().mapWith(Number),
      })
      .from(itemMutations)
      .leftJoin(items, eq(items.id, itemMutations.itemId))
      .leftJoin(users, eq(users.id, items.ownerId))
      .where(conditions)

    return mutation.count
  }

  private static buildWhereClause(query: ItemMutationFilter, user: User) {
    const conditions: ReturnType<typeof and>[] = [
      isNull(itemMutations.deletedAt),
      not(isNull(items.quantity))
    ]

    if (user.role !== RoleEnum.SuperAdmin) {
      conditions.push(
        eq(users.branchId, user.branchId)
      )
    } else if (query.branchId) {
      conditions.push(
        eq(users.branchId, +query.branchId)
      )
    }

    if (query.keyword) {
      conditions.push(
        like(items.name, `%${query.keyword}%`),
      )
    }

    if (query.itemId) {
      conditions.push(
        eq(itemMutations.itemId, +query.itemId)
      )
    }

    if (query.type) {
      conditions.push(
        eq(itemMutations.type, query.type)
      )
    }

    if (query.startAt && query.endAt) {
      conditions.push(
        gte(itemMutations.createdAt, dayjs(query.startAt).startOf('day').unix()),
        lte(itemMutations.createdAt, dayjs(query.endAt).endOf('day').unix()),
      )
    } else if (!query.endAt) {
      conditions.push(
        gte(itemMutations.createdAt, dayjs(query.startAt).startOf('day').unix()),
        lte(itemMutations.createdAt, dayjs(query.startAt).endOf('day').unix()),
      )
    } else if (!query.startAt) {
      conditions.push(
        gte(itemMutations.createdAt, dayjs(query.endAt).startOf('day').unix()),
        lte(itemMutations.createdAt, dayjs(query.endAt).endOf('day').unix()),
      )
    }

    return and(...conditions)
  }
}