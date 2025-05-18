import { index, integer, pgTable, serial } from 'drizzle-orm/pg-core';
import { items } from './items';
import { inventories } from './inventories';
import { timestamps } from './timestamps.helper';

export const inventoryDamageReports = pgTable('inventory_damage_reports', {
  id: serial('id').primaryKey(),
  itemId: integer('item_id').references(() => items.id).notNull(),
  inventoryId: integer('inventory_id').references(() => inventories.id).notNull(),
  quantity: integer('quantity').notNull(),
  damagedAt: integer('damaged_at').notNull(),
  ...timestamps,
}, (table) => [
  index('damage_item_index').on(table.itemId),
  index('damage_inventory_index').on(table.inventoryId),
  index('damage_quantity').on(table.quantity),
])