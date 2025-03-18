import { index, integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { units } from './units';
import { categories } from 'db/schema/categories';
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
}, () => [
  itemCategoryIndex,
  itemOwnerIndex
])

export const itemCategoryIndex = index('item_category_index').on(items.categoryId);
export const itemOwnerIndex = index('item_owner_index').on(items.ownerId);