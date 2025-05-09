import { index, integer, sqliteTable } from 'drizzle-orm/sqlite-core';
import { items } from './items';
import { packages } from './packages';

export const packageItems = sqliteTable('package_items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  itemId: integer('item_id').references(() => items.id).notNull(),
  packageId: integer('package_id').references(() => packages.id).notNull(),
  quantity: integer('quantity').default(1)
}, (table) => ([
  index('package_item_item_index').on(table.itemId),
  index('package_item_package_index').on(table.packageId),
  index('package_item_quantity_index').on(table.quantity),
]))