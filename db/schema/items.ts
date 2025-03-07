import { units } from './units';
import { categories } from 'db/schema/categories';
import { timestamps } from "db/schema/timestamps.helper";
import { users } from './users';
import { decimal, index, int, mysqlTable, varchar } from 'drizzle-orm/mysql-core';

export const items = mysqlTable('items', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 150 }).notNull(),
  quantity: int('quantity').notNull().default(1),
  price: decimal('price', { precision: 15, scale: 2 }).notNull().default('0'),
  unitId: int('unit').references(() => units.id).notNull(),
  categoryId: int('category_id').references(() => categories.id),
  ownerId: int('owner_id').references(() => users.id).notNull(),
  ...timestamps,
}, (table) => [
  index('item_category_index').on(table.categoryId),
  index('item_owner_index').on(table.ownerId),
])