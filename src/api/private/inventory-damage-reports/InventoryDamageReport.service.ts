import { inventoryDamageReports } from 'db/schema/inventory-damage-reports';
import { InventoryDamageReport, InventoryDamageReportFilter, InventoryDamageReportList, InventoryDamageReportRequest } from './InventoryDamageReport.schema';
import { and, between, count, desc, eq, gte, isNull, like, lte, or } from 'drizzle-orm';
import { users } from 'db/schema/users';
import { items } from 'db/schema/items';
import { profiles } from 'db/schema/profiles';
import { db } from 'db';
import { inventoryDamageReportColumns } from './InventoryDamageReport.column';
import { inventories } from 'db/schema/inventories';
import { countOffset } from '@/utils/helpers/count-offset';
import { NotFoundException } from '@/utils/exceptions/NotFoundException';
import { messages } from '@/utils/constants/locales/messages';
import { InventoryService } from '../inventories/Inventory.service';
import { AppDate } from '@/utils/libs/AppDate';

export class InventoryDamageReportService {
  static async list(query: InventoryDamageReportFilter): Promise<[InventoryDamageReportList, number]> {
    const conditions: ReturnType<typeof and>[] = [
      isNull(inventoryDamageReports.deletedAt),
    ];

    if (query.ownerId) {
      conditions.push(eq(users.id, +query.ownerId))
    }

    if (query.itemId) {
      conditions.push(eq(inventoryDamageReports.itemId, +query.itemId))
    }

    if (query.keyword) {
      conditions.push(or(
        like(items.name, `%${query.keyword}%`),
        like(profiles.name, `%${query.keyword}%`),
      ))
    }

    if (query.from && query.to) {
      conditions.push(between(inventoryDamageReports.damagedAt, Math.min(+query.from, +query.to), Math.max(+query.from, +query.to)))
    } else if (query.from) {
      conditions.push(gte(inventoryDamageReports.damagedAt, +query.from))
    } else if (query.to) {
      conditions.push(lte(inventoryDamageReports.damagedAt, +query.to))
    }

    const [_inventoryDamageReports, [meta]] = await Promise.all([
      db.select({
        ...inventoryDamageReportColumns,
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
        .from(inventoryDamageReports)
        .innerJoin(items, eq(items.id, inventoryDamageReports.itemId))
        .innerJoin(inventories, eq(inventories.id, inventoryDamageReports.inventoryId))
        .innerJoin(users, eq(users.id, inventories.ownerId))
        .innerJoin(profiles, eq(profiles.userId, users.id))
        .where(and(...conditions))
        .orderBy(desc(inventoryDamageReports.damagedAt))
        .limit(Number(query.pageSize || 5))
        .offset(countOffset(query.page, query.pageSize)),
      db.select({
        count: count().mapWith(Number)
      })
        .from(inventoryDamageReports)
        .innerJoin(items, eq(items.id, inventoryDamageReports.itemId))
        .innerJoin(inventories, eq(inventories.id, inventoryDamageReports.inventoryId))
        .innerJoin(users, eq(users.id, inventories.ownerId))
        .innerJoin(profiles, eq(profiles.userId, users.id))
        .where(and(...conditions)),
    ])

    return [_inventoryDamageReports, meta.count]
  }

  static async get(id: number): Promise<InventoryDamageReport> {
    const [inventoryDamageReport] = await db
      .select(inventoryDamageReportColumns)
      .from(inventoryDamageReports)
      .where(and(
        isNull(inventoryDamageReports.deletedAt),
        eq(inventoryDamageReports.id, id)
      ))
      .limit(1);

    if (!inventoryDamageReport) {
      throw new NotFoundException(messages.errorNotFound(`Inventory item usage with ID ${id}`))
    }

    return inventoryDamageReport;
  }

  static async create(payload: InventoryDamageReportRequest): Promise<InventoryDamageReport> {
    const inventory = await InventoryService.check(payload.inventoryId);

    const [newUsage] = await db
      .insert(inventoryDamageReports)
      .values({
        ...payload,
        itemId: inventory.itemId,
      })
      .returning(inventoryDamageReportColumns)

    return newUsage;
  }

  static async update(id: number, payload: InventoryDamageReportRequest): Promise<InventoryDamageReport> {
    const inventory = await InventoryService.check(payload.inventoryId);

    const [updatedUsage] = await db
      .update(inventoryDamageReports)
      .set({
        ...payload,
        itemId: inventory.itemId,
      })
      .where(and(
        isNull(inventories.deletedAt),
        eq(inventories.id, id),
      ))
      .returning(inventoryDamageReportColumns)

    if (!updatedUsage) {
      throw new NotFoundException(messages.errorNotFound(`Inventory item usage with ID ${id}`))
    }

    return updatedUsage;
  }

  static async delete(id: number): Promise<void> {
    const [deletedUsage] = await db
      .update(inventoryDamageReports)
      .set({
        deletedAt: new AppDate().unix()
      })
      .where(and(
        isNull(inventories.deletedAt),
        eq(inventories.id, id),
      ))
      .returning(inventoryDamageReportColumns)

    if (!deletedUsage) {
      throw new NotFoundException(messages.errorNotFound(`Inventory item usage with ID ${id}`))
    }
  }

  private constructor() { }
}