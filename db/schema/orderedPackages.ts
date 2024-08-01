import { relations } from 'drizzle-orm';
import { integer, sqliteTable } from 'drizzle-orm/sqlite-core';
import { ordersTable } from './orders';
import { unitsTable } from './units';
import { packageItemsTable } from './packageItems';

export const orderedPackagesTable = sqliteTable('ordered_items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  packageId: integer('package_id').notNull(),
  orderId: integer('order_id').notNull(),
  baseQuantity: integer('base_quantity').notNull(),
  orderedQuantity: integer('ordered_quantity').notNull(),
  orderedUnitId: integer('ordered_unit').notNull(),
  createdAt: integer('created_at', { mode: 'number' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'number' }),
  deletedAt: integer('deleted_at', { mode: 'number' }),
})

export const orderedPackagesRelations = relations(orderedPackagesTable, ({ one }) => ({
  package: one(packageItemsTable, {
    fields: [orderedPackagesTable.packageId],
    references: [packageItemsTable.id],
    relationName: 'package.orderedPackages',
  }),
  order: one(ordersTable, {
    fields: [orderedPackagesTable.orderId],
    references: [ordersTable.id],
    relationName: 'order.orderedPackages',
  }),
  orderedUnit: one(unitsTable, {
    fields: [orderedPackagesTable.orderedUnitId],
    references: [unitsTable.id],
    relationName: 'unit.orderedPackages',
  }),
}));