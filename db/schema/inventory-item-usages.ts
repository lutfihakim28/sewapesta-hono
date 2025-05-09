import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { inventoryItems } from './inventory-items';
import { items } from './items';
import { timestamps } from './timestamps.helper';

export const inventoryItemUsages = sqliteTable('inventory_item_usages', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  // TODO: add orderId
  itemId: integer('item_id').references(() => items.id).notNull(),
  inventoryItemId: integer('inventory_item_id').references(() => inventoryItems.id).notNull(),
  orderQuantity: integer('order_quantity').notNull(),
  returnQuantity: integer('return_quantity').notNull(),
  description: text('description'),
  returnAt: integer('return_at'),
  ...timestamps,
}, (table) => [
  index('usage_item_index').on(table.itemId),
  index('usage_inventory_item_index').on(table.inventoryItemId),
  index('usage_order_quantity').on(table.orderQuantity),
  index('usage_return_quantity').on(table.returnQuantity),
])