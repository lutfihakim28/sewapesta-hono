import { relations } from 'drizzle-orm';
import { integer, sqliteTable } from 'drizzle-orm/sqlite-core';
import { itemsTable } from './items';
import { packagesTable } from './packages';

export const packageItemsTable = sqliteTable('item_prices', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  itemId: integer('item_id').notNull(),
  packageId: integer('package_id').notNull(),
})

export const packageItemsRelations = relations(packageItemsTable, ({ one }) => ({
  item: one(itemsTable, {
    fields: [packageItemsTable.itemId],
    references: [itemsTable.id],
    relationName: 'item.packageItems',
  }),
  package: one(packagesTable, {
    fields: [packageItemsTable.packageId],
    references: [packagesTable.id],
    relationName: 'package.packageItems',
  }),
}))