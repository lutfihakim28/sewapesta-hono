import { index, integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { owners } from './owners';
import { relations } from 'drizzle-orm';
import { units } from './units';
import { categories } from 'db/schema/categories';
import { itemMutations } from 'db/schema/itemMutations';
import { productsItems } from 'db/schema/productsItems';
import {timestamps} from "db/schema/timestamps.helper";

export const items = sqliteTable('items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  quantity: integer('quantity').notNull().default(1),
  overtime: real('overtime').default(0),
  price: real('price').notNull().default(0),
  unitId: integer('unit').references(() => units.id, { onDelete: 'cascade' }).notNull(),
  categoryId: integer('category_id').references(() => categories.id, { onDelete: 'cascade' }),
  ownerId: integer('owner_id').references(() => owners.id, { onDelete: 'cascade' }).notNull(),
  ...timestamps,
}, (table) => ({
  itemCategoryIndex: index('item_category_index').on(table.categoryId),
  itemOwnerIndex: index('item_owner_index').on(table.ownerId),
}))

export const itemsRelations = relations(items, ({ one, many }) => ({
  category: one(categories, {
    fields: [ items.categoryId],
    references: [categories.id],
  }),
  owner: one(owners, {
    fields: [ items.ownerId],
    references: [owners.id],
  }),
  unit: one(units, {
    fields: [ items.unitId],
    references: [units.id],
  }),
  stockMutations: many(itemMutations),
  productItems: many(productsItems),
}))