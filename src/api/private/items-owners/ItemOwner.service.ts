import { SortEnum } from '@/lib/enums/SortEnum';
import { User } from '../users/User.schema';
import { ItemOwner, ItemOwnerColumn, ItemOwnerExtended, ItemOwnerFilter, ItemOwnerRequest, ItemOwnerUpdateRequest } from './ItemOwner.schema';
import { and, asc, count, desc, eq, inArray, isNull, like, or } from 'drizzle-orm';
import { itemsOwners } from 'db/schema/items-owners';
import { items } from 'db/schema/items';
import { profiles } from 'db/schema/profiles';
import { RoleEnum } from '@/lib/enums/RoleEnum';
import { users } from 'db/schema/users';
import { db } from 'db';
import { itemOwnerColumns } from './ItemOwner.column';
import { itemColumns } from '../items/Item.column';
import { userColumns } from '../users/User.column';
import { countOffset } from '@/lib/utils/count-offset';
import { ItemService } from '../items/Item.service';
import { UserService } from '../users/User.service';
import { BadRequestException } from '@/lib/exceptions/BadRequestException';
import { NotFoundException } from '@/lib/exceptions/NotFoundException';
import { messages } from '@/lib/constants/messages';
import dayjs from 'dayjs';

export abstract class ItemOwnerService {
  static async list(query: ItemOwnerFilter, user: User): Promise<[ItemOwnerExtended[], number]> {
    let sort: SortEnum = SortEnum.Ascending;
    let sortBy: ItemOwnerColumn = 'id';

    if (query.sort) {
      sort = query.sort
    }

    if (query.sortBy) {
      sortBy = query.sortBy
    }

    const orderBy = sort === SortEnum.Ascending
      ? asc(itemsOwners[sortBy])
      : desc(itemsOwners[sortBy])

    const conditions: ReturnType<typeof and>[] = [
      isNull(itemsOwners.deletedAt)
    ]
    const isSuperAdmin = user.role === RoleEnum.SuperAdmin
    const isAdminOrOwner = user.role === RoleEnum.Admin || user.role === RoleEnum.Owner

    if (query.itemId) {
      conditions.push(eq(itemsOwners.itemId, +query.itemId))
    }

    if (query.keyword) {
      conditions.push(or(
        like(items.name, `%${query.keyword}%`),
        like(profiles.name, `%${query.keyword}%`),
      ))
    }
    if (isSuperAdmin) {
      if (query.branchId) {
        conditions.push(eq(users.branchId, +query.branchId))
      }
      if (query.ownerId) {
        conditions.push(eq(users.id, +query.ownerId))
      }
    }

    if (isAdminOrOwner) {
      conditions.push(eq(users.branchId, user.branchId))
      if (query.ownerId) {
        const ownerSubQuery = db.select()
          .from(users)
          .where(and(
            isNull(users.deletedAt),
            eq(users.branchId, user.branchId),
            eq(users.id, +query.ownerId)
          ))

        conditions.push(inArray(
          users.id,
          ownerSubQuery
        ))
      }
    }

    const [_itemsOwners, [{ count: _count }]] = await Promise.all([
      db.select({
        ...itemOwnerColumns,
        item: itemColumns,
        owner: userColumns
      })
        .from(itemsOwners)
        .innerJoin(items, eq(items.id, itemsOwners.itemId))
        .innerJoin(users, eq(users.id, itemsOwners.ownerId))
        .innerJoin(profiles, eq(profiles.userId, users.id))
        .where(and(...conditions))
        .orderBy(orderBy)
        .limit(Number(query.pageSize || 5))
        .offset(countOffset(query.page, query.pageSize)),
      db.select({
        count: count().mapWith(Number)
      })
        .from(itemsOwners)
        .innerJoin(items, eq(items.id, itemsOwners.itemId))
        .innerJoin(users, eq(users.id, itemsOwners.ownerId))
        .innerJoin(profiles, eq(profiles.userId, users.id))
        .where(and(...conditions))
        .orderBy(orderBy)
        .limit(Number(query.pageSize || 5))
        .offset(countOffset(query.page, query.pageSize)),
    ])

    return [_itemsOwners, _count]
  }

  static async create(payload: ItemOwnerRequest, user: User): Promise<ItemOwnerExtended> {
    const existingData = await db
      .select({ id: itemsOwners.id })
      .from(itemsOwners)
      .where(and(
        isNull(itemsOwners.deletedAt),
        eq(itemsOwners.itemId, payload.itemId),
        eq(itemsOwners.ownerId, payload.ownerId),
      ))

    if (existingData.length > 0) {
      throw new BadRequestException(`Item ID ${payload.itemId} already owned by owner with ID ${payload.ownerId}`)
    }

    const item = await ItemService.check(payload.itemId);
    const owner = await UserService.check(payload.ownerId, user);

    const [newItemOwner] = await db
      .insert(itemsOwners)
      .values(payload)
      .returning(itemOwnerColumns)

    if (!newItemOwner) {
      throw new BadRequestException(`Item ID ${item.id} and Owner ID ${item.id} already paired. Please use update instead if you want to change their pairs properties.`)
    }

    return {
      ...newItemOwner,
      item,
      owner,
    }
  }

  static async update(id: number, payload: ItemOwnerUpdateRequest, user: User) {
    const [newItemOwner] = await db
      .update(itemsOwners)
      .set(payload)
      .where(and(
        isNull(itemsOwners.deletedAt),
        eq(itemsOwners.id, id)
      ))
      .returning(itemOwnerColumns)


    if (!newItemOwner) {
      new NotFoundException(messages.errorNotFound(`Item owner with ID ${id}`))
    }

    const item = await ItemService.check(newItemOwner.itemId);
    const owner = await UserService.check(newItemOwner.ownerId, user);

    return {
      ...newItemOwner,
      item,
      owner,
    }
  }

  static async delete(id: number) {
    await db
      .update(itemsOwners)
      .set({
        deletedAt: dayjs().unix()
      })
      .where(and(
        isNull(itemsOwners.deletedAt),
        eq(itemsOwners.id, id)
      ))
  }

  static async check(id: number, user: User) {
    const conditions = [
      isNull(itemsOwners.deletedAt),
      eq(itemsOwners.id, id),
    ]

    if (user.role !== RoleEnum.SuperAdmin) {
      conditions.push(inArray(
        itemsOwners.ownerId,
        db.select({ id: users.id })
          .from(users)
          .where(and(
            isNull(users.deletedAt),
            eq(users.branchId, user.branchId)
          ))
      ))
    }

    const [itemOwner] = await db.select(itemColumns)
      .from(itemsOwners)
      .where(and(...conditions))
      .limit(1)

    if (!itemOwner) {
      throw new NotFoundException(messages.errorNotFound(`Item owner with ID ${id}`))
    }

    return itemOwner
  }
}