import { ItemService } from '@/api/private/items/Item.service';
import { messages } from '@/lib/constants/messages';
import { RoleEnum } from '@/lib/enums/RoleEnum';
import { SortEnum } from '@/lib/enums/SortEnum';
import { NotFoundException } from '@/lib/exceptions/NotFoundException';
import { countOffset } from '@/lib/utils/count-offset';
import dayjs from 'dayjs';
import { db } from 'db';
import { stockMutations } from 'db/schema/stock-mutations';
import { items } from 'db/schema/items';
import { profiles } from 'db/schema/profiles';
import { users } from 'db/schema/users';
import { and, asc, count, desc, eq, gte, isNull, like, lte, not, sql } from 'drizzle-orm';
import { itemColumns } from '../items/Item.column';
import { profileColumns } from '../users/User.column';
import { User } from '../users/User.schema';
import { stockMutationsColumns } from './StockMutation.column';
import {
  StockMutation,
  StockMutationColumn,
  StockMutationExtended,
  StockMutationFilter,
  StockMutationRequest,
} from './StockMutation.schema';
import { StockMutationTypeEnum } from '@/lib/enums/StockMutationType.Enum';
import { itemsOwners } from 'db/schema/items-owners';
import { ItemOwnerService } from '../items-owners/ItemOwner.service';

export abstract class StockMutationService {
  static async list(query: StockMutationFilter, user: User): Promise<[StockMutationExtended[], number]> {
    let sort: SortEnum = SortEnum.Ascending;
    let sortBy: StockMutationColumn = 'id';

    if (query.sort) {
      sort = query.sort
    }

    if (query.sortBy) {
      sortBy = query.sortBy
    }

    const orderBy = sort === SortEnum.Ascending
      ? asc(stockMutations[sortBy])
      : desc(stockMutations[sortBy])

    const conditions: ReturnType<typeof and>[] = [
      isNull(stockMutations.deletedAt),
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

    if (query.itemOwnerId) {
      conditions.push(
        eq(stockMutations.itemOwnerId, +query.itemOwnerId)
      )
    }

    if (query.type) {
      conditions.push(
        eq(stockMutations.type, query.type)
      )
    }

    if (query.startAt && query.endAt) {
      conditions.push(
        gte(stockMutations.createdAt, dayjs(query.startAt).startOf('day').unix()),
        lte(stockMutations.createdAt, dayjs(query.endAt).endOf('day').unix()),
      )
    } else if (!query.endAt) {
      conditions.push(
        gte(stockMutations.createdAt, dayjs(query.startAt).startOf('day').unix()),
        lte(stockMutations.createdAt, dayjs(query.startAt).endOf('day').unix()),
      )
    } else if (!query.startAt) {
      conditions.push(
        gte(stockMutations.createdAt, dayjs(query.endAt).startOf('day').unix()),
        lte(stockMutations.createdAt, dayjs(query.endAt).endOf('day').unix()),
      )
    }

    const [_itemsMutations, [{ count: _count }]] = await Promise.all([
      db
        .select({
          ...stockMutationsColumns,
          item: itemColumns,
          owner: profileColumns
        })
        .from(stockMutations)
        .innerJoin(itemsOwners, eq(itemsOwners.id, stockMutations.itemOwnerId))
        .innerJoin(items, eq(items.id, itemsOwners.itemId))
        .innerJoin(users, eq(users.id, itemsOwners.ownerId))
        .innerJoin(profiles, eq(profiles.userId, users.id))
        .where(and(...conditions))
        .orderBy(orderBy)
        .limit(Number(query.pageSize || 5))
        .offset(countOffset(query.page, query.pageSize)),
      db
        .select({
          count: count().mapWith(Number),
        })
        .from(stockMutations)
        .innerJoin(itemsOwners, eq(itemsOwners.id, stockMutations.itemOwnerId))
        .where(and(...conditions)),
    ]);

    return [_itemsMutations, _count]
  }

  static async get(id: number, user: User): Promise<StockMutationExtended> {
    const conditions: ReturnType<typeof and>[] = [
      eq(stockMutations.id, id),
      isNull(stockMutations.deletedAt),
    ]

    if (user.role !== RoleEnum.SuperAdmin) {
      conditions.push(
        eq(users.branchId, user.branchId)
      )
    }

    const [mutation] = await db
      .select({
        ...stockMutationsColumns,
        item: itemColumns,
        owner: profileColumns
      })
      .from(stockMutations)
      .innerJoin(itemsOwners, eq(itemsOwners.id, stockMutations.itemOwnerId))
      .innerJoin(items, eq(items.id, itemsOwners.itemId))
      .innerJoin(users, eq(users.id, itemsOwners.ownerId))
      .innerJoin(profiles, eq(profiles.userId, users.id))
      .where(and(...conditions))
      .limit(1)

    if (!mutation) {
      throw new NotFoundException(messages.errorNotFound(`Item mutation with ID ${id}`));
    }

    return mutation
  }

  static async create(payload: StockMutationRequest, user: User): Promise<StockMutation> {
    await ItemOwnerService.check(payload.itemOwnerId, user)

    return await db.transaction(async (transaction) => {
      if (payload.affectItemQuantity) {
        const latestAdjustment = await transaction.select()
      }
      return;
    })
  }

  static async update(id: number, payload: StockMutationRequest, user: User): Promise<StockMutation> {
    await ItemService.check(id, user)

    const [mutation] = await db
      .update(stockMutations)
      .set(payload)
      .where(and(
        eq(stockMutations.id, id),
        isNull(stockMutations.deletedAt),
      ))
      .returning(stockMutationsColumns)

    if (!mutation) {
      throw new NotFoundException(messages.errorNotFound(`Item mutation with ID ${id}`));
    }

    return mutation;
  }

  static async delete(id: number, user: User): Promise<void> {
    await ItemService.check(id, user)

    const [mutation] = await db
      .update(stockMutations)
      .set({
        deletedAt: dayjs().unix()
      })
      .where(and(
        eq(stockMutations.id, id),
        isNull(stockMutations.deletedAt),
      ))
      .returning(stockMutationsColumns)

    if (!mutation) {
      throw new NotFoundException(messages.errorNotFound(`Item mutation with ID ${id}`));
    }
  }
}