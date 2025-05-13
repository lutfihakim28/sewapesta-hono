import { index, integer, sqliteTable } from 'drizzle-orm/sqlite-core';
import { items } from './items';
import { users } from './users';
import { timestamps } from './timestamps.helper';

export const inventoryItems = sqliteTable('inventory_items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  itemId: integer('item_id').references(() => items.id).notNull(),
  ownerId: integer('owner_id').references(() => users.id).notNull(),
  totalQuantity: integer('total_quantity').default(0),
  ...timestamps,
}, (table) => ([
  index('inventory_item_item_index').on(table.itemId),
  index('inventory_item_owner_index').on(table.ownerId),
]))