import { index, integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { units } from './units';
import { categories } from 'db/schema/categories';
import { timestamps } from "db/schema/timestamps.helper";
import { users } from './users';

export const items = sqliteTable('items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  price: real('price').notNull().default(0),
  unitId: integer('unit').references(() => units.id).notNull(),
  categoryId: integer('category_id').references(() => categories.id).notNull(),
  ownerId: integer('owner_id').references(() => users.id).notNull(),
  ...timestamps,
}, (table) => [
  index('item_category_index').on(table.categoryId),
  index('item_owner_index').on(table.ownerId),
])
