import { integer, sqliteTable } from 'drizzle-orm/sqlite-core';
import { timestamps } from './timestamps.helper';
import { items } from './items';
import { users } from './users';

export const itemRevenueTerms = sqliteTable('item_revenue_terms', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  itemId: integer('item_id').references(() => items.id).notNull(),
  ownerId: integer('owner_id').references(() => users.id).notNull(),
  ownerPrice: integer('owner_price'),
  employeePrice: integer('employee_price'),
  ...timestamps,
})