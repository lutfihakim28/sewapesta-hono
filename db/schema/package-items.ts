import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { items } from './items';
import { packages } from './packages';
import { ItemTypeEnum } from '@/utils/enums/ItemTypeEnum';
import { timestamps } from './timestamps.helper';

export const packageItems = sqliteTable('package_items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  itemId: integer('item_id').references(() => items.id).notNull(),
  // reference: text('reference', {
  //   enum: [ItemTypeEnum.Equipment, ItemTypeEnum.Inventory]
  // }).notNull(),
  // referenceId: integer('reference_id').notNull(),
  packageId: integer('package_id').references(() => packages.id).notNull(),
  quantity: integer('quantity').default(1),
  ...timestamps,
}, (table) => ([
  index('package_item_item_index').on(table.itemId),
  // index('package_item_reference_index').on(table.reference),
  // index('package_item_reference_id_index').on(table.referenceId),
  index('package_item_package_index').on(table.packageId),
  index('package_item_quantity_index').on(table.quantity),
]))