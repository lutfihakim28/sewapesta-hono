import { ItemService } from '@/api/private/items/Item.service';
import { messages } from '@/lib/constants/messages';
import { RoleEnum } from '@/lib/enums/RoleEnum';
import { SortEnum } from '@/lib/enums/SortEnum';
import { NotFoundException } from '@/lib/exceptions/NotFoundException';
import { countOffset } from '@/lib/utils/count-offset';
import dayjs from 'dayjs';
import { db } from 'db';
import { itemMutations } from 'db/schema/item-mutations';
import { items } from 'db/schema/items';
import { profiles } from 'db/schema/profiles';
import { users } from 'db/schema/users';
import { and, asc, count, desc, eq, gte, isNull, like, lte, not, sql } from 'drizzle-orm';
import { itemColumns } from '../items/Item.column';
import { profileColumns } from '../users/User.column';
import { User } from '../users/User.schema';
import { itemMutationsColumns } from './ItemMutation.column';
import {
  ItemMutation,
  ItemMutationColumn,
  ItemMutationExtended,
  ItemMutationFilter,
  ItemMutationRequest,
} from './ItemMutation.schema';
import { ItemMutationTypeEnum } from '@/lib/enums/ItemMutationType.Enum';

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

    return await Promise.all([
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
    ]);
  }

  static async get(id: number, user: User): Promise<ItemMutation> {
    const conditions: ReturnType<typeof and>[] = [
      eq(itemMutations.id, id),
      isNull(itemMutations.deletedAt),
    ]

    if (user.role !== RoleEnum.SuperAdmin) {
      conditions.push(
        eq(users.branchId, user.branchId)
      )
    }

    const [mutation] = await db
      .select(itemMutationsColumns)
      .from(itemMutations)
      .innerJoin(items, eq(items.id, itemMutations.itemId))
      .innerJoin(users, eq(users.id, items.ownerId))
      .where(and(...conditions))
      .limit(1)

    if (!mutation) {
      throw new NotFoundException(messages.errorNotFound(`Item mutation with ID ${id}`));
    }

    return mutation
  }

  static async create(payload: ItemMutationRequest, user: User): Promise<ItemMutation> {
    await ItemService.check(payload.itemId, user)

    const [mutation] = await db
      .insert(itemMutations)
      .values(payload)
      .returning(itemMutationsColumns)

    return mutation

  }

  static async update(id: number, payload: ItemMutationRequest, user: User): Promise<ItemMutation> {
    await ItemService.check(id, user)

    const [mutation] = await db
      .update(itemMutations)
      .set(payload)
      .where(and(
        eq(itemMutations.id, id),
        isNull(itemMutations.deletedAt),
      ))
      .returning(itemMutationsColumns)

    if (!mutation) {
      throw new NotFoundException(messages.errorNotFound(`Item mutation with ID ${id}`));
    }

    return mutation;
  }

  static async delete(id: number, user: User): Promise<void> {
    await ItemService.check(id, user)

    const [mutation] = await db
      .update(itemMutations)
      .set({
        deletedAt: dayjs().unix()
      })
      .where(and(
        eq(itemMutations.id, id),
        isNull(itemMutations.deletedAt),
      ))
      .returning(itemMutationsColumns)

    if (!mutation) {
      throw new NotFoundException(messages.errorNotFound(`Item mutation with ID ${id}`));
    }
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