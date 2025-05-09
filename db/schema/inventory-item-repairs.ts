import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { items } from './items';
import { inventoryItems } from './inventory-items';
import { timestamps } from './timestamps.helper';

export const inventoryItemRepairs = sqliteTable('inventory_item_repairs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  itemId: integer('item_id').references(() => items.id).notNull(),
  inventoryItemId: integer('inventory_item_id').references(() => inventoryItems.id).notNull(),
  quantity: integer('quantity').notNull(),
  repairedBy: text('repaired_by'),
  description: text('description'),
  ...timestamps,
}, (table) => [
  index('repair_item_index').on(table.itemId),
  index('repair_inventory_item_index').on(table.inventoryItemId),
  index('repair_quantity').on(table.quantity),
])