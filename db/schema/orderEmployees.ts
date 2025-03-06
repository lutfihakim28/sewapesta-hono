import { integer, sqliteTable } from 'drizzle-orm/sqlite-core';
import { orders } from './orders';
import { users } from './users';

export const orderEmployees = sqliteTable('order_employees', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  orderId: integer('order_id').references(() => orders.id).notNull(),
  employeeId: integer('employee_id').references(() => users.id).notNull(),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at'),
  deletedAt: integer('deleted_at'),
})