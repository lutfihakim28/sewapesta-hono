import { index, integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';
import { units } from './units';
import { categories } from 'db/schema/categories';
import { itemMutations } from 'db/schema/itemMutations';
import { productsItems } from 'db/schema/productsItems';
import { timestamps } from "db/schema/timestamps.helper";
import { users } from './users';

export const items = sqliteTable('items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  quantity: integer('quantity').notNull().default(1),
  price: real('price').notNull().default(0),
  unitId: integer('unit').references(() => units.id).notNull(),
  categoryId: integer('category_id').references(() => categories.id),
  ownerId: integer('owner_id').references(() => users.id).notNull(),
  ...timestamps,
}, (table) => ({
  itemCategoryIndex: index('item_category_index').on(table.categoryId),
  itemOwnerIndex: index('item_owner_index').on(table.ownerId),
}))

export const itemsRelations = relations(items, ({ one, many }) => ({
  category: one(categories, {
    fields: [items.categoryId],
    references: [categories.id],
  }),
  owner: one(users, {
    fields: [items.ownerId],
    references: [users.id],
  }),
  unit: one(units, {
    fields: [items.unitId],
    references: [units.id],
  }),
  mutations: many(itemMutations),
  products: many(productsItems),
}))