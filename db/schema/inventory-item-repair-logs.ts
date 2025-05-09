import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { items } from './items';
import { timestamps } from './timestamps.helper';
import { inventoryItemRepairs } from './inventory-item-repairs';
import { RepairLogStatusEnum } from '@/lib/enums/RepairLogStatusEnum';

export const inventoryItemRepairLogs = sqliteTable('inventory_item_repair_log', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  itemId: integer('item_id').references(() => items.id).notNull(),
  repairId: integer('repair_id').references(() => inventoryItemRepairs.id).notNull(),
  quantity: integer('quantity'),
  status: text('status', {
    enum: [
      RepairLogStatusEnum.Fixed,
      RepairLogStatusEnum.Failed,
      RepairLogStatusEnum.Cancelled,
    ],
  }).notNull().default(RepairLogStatusEnum.Fixed),
  ...timestamps,
}, (table) => [
  index('repair_log_item_index').on(table.itemId),
  index('repair_log_repair_index').on(table.repairId),
  index('repair_log_quantity').on(table.quantity),
  index('repair_log_status').on(table.status),
])