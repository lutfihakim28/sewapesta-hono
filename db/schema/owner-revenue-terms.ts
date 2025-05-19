import { integer, sqliteTable, real } from 'drizzle-orm/sqlite-core';
import { timestamps } from './timestamps.helper';
import { users } from './users';

export const ownerRevenueTerms = sqliteTable('owner_revenue_terms', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  ownerId: integer('owner_id').references(() => users.id).notNull(),
  ownerRatio: real('owner_ratio'),
  employeeRatio: real('employee_ratio'),
  ...timestamps,
})