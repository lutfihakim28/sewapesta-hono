import { relations } from 'drizzle-orm';
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

export const orderEmployeesRelations = relations(orderEmployees, ({ one }) => ({
  order: one(orders, {
    fields: [orderEmployees.orderId],
    references: [orders.id],
  }),
  employee: one(users, {
    fields: [orderEmployees.employeeId],
    references: [users.id],
  }),
}))