import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { units } from './units';
import { categories } from 'db/schema/categories';
import { timestamps } from "db/schema/timestamps.helper";

export const items = sqliteTable('items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull().unique(),
  unitId: integer('unit_id').references(() => units.id).notNull(),
  categoryId: integer('category_id').references(() => categories.id).notNull(),
  ...timestamps,
}, (table) => [
  index('item_category_index').on(table.categoryId),
])
