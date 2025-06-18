import { PackageItem, PackageItemColumn, PackageItemFilter, PackageItemList, PackageItemRequest } from './PackageItem.schema';
import { and, asc, count, desc, eq, isNull, like, or } from 'drizzle-orm';
import { users } from 'db/schema/users';
import { items } from 'db/schema/items';
import { profiles } from 'db/schema/profiles';
import { db } from 'db';
import { packageItemColumns } from './PackageItem.column';
import { inventories } from 'db/schema/inventories';
import { countOffset } from '@/utils/helpers/count-offset';
import { NotFoundException } from '@/utils/exceptions/NotFoundException';
import { AppDate } from '@/utils/libs/AppDate';
import { packageItems } from 'db/schema/package-items';
import { packages } from 'db/schema/packages';
import { equipments } from 'db/schema/equipments';
import { ItemService } from '../items/Item.service';
import { PackageService } from '../packages/Package.service';
import { SortDirectionEnum } from '@/utils/enums/SortDirectionEnum';

export class PackageItemService {
  static async list(query: PackageItemFilter): Promise<[PackageItemList, number]> {
    const conditions: ReturnType<typeof and>[] = [
      isNull(packageItems.deletedAt),
    ];

    if (query.itemId) {
      conditions.push(eq(packageItems.itemId, +query.itemId))
    }

    if (query.keyword) {
      conditions.push(or(
        like(items.name, `%${query.keyword}%`),
        like(profiles.name, `%${query.keyword}%`),
      ))
    }

    let listingQuery = db.select({
      ...packageItemColumns,
      owner: {
        id: users.id,
        name: profiles.name,
        phone: profiles.phone,
      },
      item: {
        id: items.id,
        name: items.name,
      },
      package: {
        id: packages.id,
        name: packages.name
      }
    })
      .from(packageItems)
      .innerJoin(items, eq(items.id, packageItems.itemId))
      .innerJoin(users, or(
        eq(users.id, inventories.ownerId),
        eq(users.id, equipments.ownerId),
      ))
      .innerJoin(profiles, eq(profiles.userId, users.id))
      .where(and(...conditions))
      .$dynamic()

    if (query.sort && query.sortDirection) {
      const orderFn = query.sortDirection === SortDirectionEnum.Desc ? desc : asc;
      const sort = query.sort as PackageItemColumn;
      const order = orderFn(packageItems[sort]);

      listingQuery = listingQuery.orderBy(order);
    }

    const [_packageItems, [meta]] = await Promise.all([
      listingQuery
        .limit(Number(query.pageSize || 5))
        .offset(countOffset(query.page, query.pageSize)),
      db.select({
        count: count().mapWith(Number)
      })
        .from(packageItems)
        .innerJoin(items, eq(items.id, packageItems.itemId))
        .innerJoin(users, or(
          eq(users.id, inventories.ownerId),
          eq(users.id, equipments.ownerId),
        ))
        .innerJoin(profiles, eq(profiles.userId, users.id))
        .where(and(...conditions)),
    ])

    return [_packageItems, meta.count]
  }

  static async get(id: number): Promise<PackageItem> {
    const [inventoryUsage] = await db
      .select(packageItemColumns)
      .from(packageItems)
      .where(and(
        isNull(packageItems.deletedAt),
        eq(packageItems.id, id)
      ))
      .limit(1);

    return inventoryUsage;
  }

  static async create(payload: PackageItemRequest): Promise<PackageItem> {
    await ItemService.check(payload.itemId)
    await PackageService.check(payload.packageId)

    const [newUsage] = await db
      .insert(packageItems)
      .values(payload)
      .returning(packageItemColumns)

    return newUsage;
  }

  static async update(id: number, payload: PackageItemRequest): Promise<PackageItem> {
    await ItemService.check(payload.itemId)
    await PackageService.check(payload.packageId)

    const [updatedUsage] = await db
      .update(packageItems)
      .set(payload)
      .where(and(
        isNull(packageItems.deletedAt),
        eq(packageItems.id, id),
      ))
      .returning(packageItemColumns)

    if (!updatedUsage) {
      throw new NotFoundException('packageItem', id)
    }

    return updatedUsage;
  }

  static async delete(id: number): Promise<void> {
    const [deletedUsage] = await db
      .update(packageItems)
      .set({
        deletedAt: new AppDate().unix()
      })
      .where(and(
        isNull(packageItems.deletedAt),
        eq(packageItems.id, id),
      ))
      .returning(packageItemColumns)

    if (!deletedUsage) {
      throw new NotFoundException('packageItem', id)
    }
  }

  private constructor() { }
}