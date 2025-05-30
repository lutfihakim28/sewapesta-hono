import { PackageItem, PackageItemColumn, PackageItemFilter, PackageItemList, PackageItemListColumn, PackageItemRequest, sortablePackageItemColumns } from './PackageItem.schema';
import { and, asc, count, desc, eq, isNull, like, or, SQL } from 'drizzle-orm';
import { users } from 'db/schema/users';
import { items } from 'db/schema/items';
import { profiles } from 'db/schema/profiles';
import { db } from 'db';
import { packageItemColumns } from './PackageItem.column';
import { inventories } from 'db/schema/inventories';
import { countOffset } from '@/utils/helpers/count-offset';
import { NotFoundException } from '@/utils/exceptions/NotFoundException';
import { messages } from '@/utils/constants/messages';
import { AppDate } from '@/utils/libs/AppDate';
import { packageItems } from 'db/schema/package-items';
import { packages } from 'db/schema/packages';
import { equipments } from 'db/schema/equipments';

export class PackageItemService {
  static async list(query: PackageItemFilter): Promise<[PackageItemList, number]> {
    let orders: SQL<unknown>[] = [];

    const pushOrders = (
      cols: string | string[] | undefined,
      direction: 'asc' | 'desc'
    ) => {
      const targetCols = Array.isArray(cols) ? cols : [cols];
      const isAsc = direction === 'asc';
      const opposite = isAsc ? 'desc' : 'asc';

      targetCols.forEach((col) => {
        if (!sortablePackageItemColumns.includes(col as PackageItemListColumn)) return;
        if ((query[opposite] as PackageItemListColumn[]).includes(col as PackageItemListColumn)) return;

        const orderFn = isAsc ? asc : desc;
        if (col === 'item') {
          orders.push(orderFn(items.name))
          return;
        }
        if (col === 'owner') {
          orders.push(orderFn(profiles.name))
          return;
        }
        if (col === 'package') {
          orders.push(orderFn(packages.name))
          return;
        }
        orders.push(orderFn(packageItems[col as PackageItemColumn]));
      });
    };

    pushOrders(query.asc, 'asc');
    pushOrders(query.desc, 'desc');

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

    const [_packageItems, [meta]] = await Promise.all([
      db.select({
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
        // .leftJoin(inventories, and(
        //   eq(packageItems.reference, ItemTypeEnum.Inventory),
        //   eq(inventories.id, packageItems.referenceId),
        // ))
        // .leftJoin(equipments, and(
        //   eq(packageItems.reference, ItemTypeEnum.Equipment),
        //   eq(equipments.id, packageItems.referenceId),
        // ))
        .innerJoin(users, or(
          eq(users.id, inventories.ownerId),
          eq(users.id, equipments.ownerId),
        ))
        .innerJoin(profiles, eq(profiles.userId, users.id))
        .where(and(...conditions))
        .orderBy(...orders)
        .limit(Number(query.pageSize || 5))
        .offset(countOffset(query.page, query.pageSize)),
      db.select({
        count: count().mapWith(Number)
      })
        .from(packageItems)
        .innerJoin(items, eq(items.id, packageItems.itemId))
        // .leftJoin(inventories, and(
        //   eq(packageItems.reference, ItemTypeEnum.Inventory),
        //   eq(inventories.id, packageItems.referenceId),
        // ))
        // .leftJoin(equipments, and(
        //   eq(packageItems.reference, ItemTypeEnum.Equipment),
        //   eq(equipments.id, packageItems.referenceId),
        // ))
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

    if (!inventoryUsage) {
      throw new NotFoundException(messages.errorNotFound(`Package item with ID ${id}`))
    }

    return inventoryUsage;
  }

  static async create(payload: PackageItemRequest): Promise<PackageItem> {
    let itemId: number = -1;

    // if (payload.reference === ItemTypeEnum.Inventory) {
    //   const inventory = await InventoryService.check(payload.referenceId);
    //   itemId = inventory.itemId
    // }

    // if (payload.reference === ItemTypeEnum.Equipment) {
    //   const equipment = await EquipmentService.check(payload.referenceId);
    //   itemId = equipment.itemId
    // }

    const [newUsage] = await db
      .insert(packageItems)
      .values(payload)
      .returning(packageItemColumns)

    return newUsage;
  }

  static async update(id: number, payload: PackageItemRequest): Promise<PackageItem> {
    // let itemId: number = -1;

    // if (payload.reference === ItemTypeEnum.Inventory) {
    //   const inventory = await InventoryService.check(payload.referenceId);
    //   itemId = inventory.itemId
    // }

    // if (payload.reference === ItemTypeEnum.Equipment) {
    //   const equipment = await EquipmentService.check(payload.referenceId);
    //   itemId = equipment.itemId
    // }

    const [updatedUsage] = await db
      .update(packageItems)
      .set(payload)
      .where(and(
        isNull(packageItems.deletedAt),
        eq(packageItems.id, id),
      ))
      .returning(packageItemColumns)

    if (!updatedUsage) {
      throw new NotFoundException(messages.errorNotFound(`Package item with ID ${id}`))
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
      throw new NotFoundException(messages.errorNotFound(`Package item with ID ${id}`))
    }
  }

  private constructor() { }
}