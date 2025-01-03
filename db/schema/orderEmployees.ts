import { relations } from 'drizzle-orm';
import { integer, sqliteTable } from 'drizzle-orm/sqlite-core';
import { orders } from './orders';
import { employees } from './employees';

export const orderEmployees = sqliteTable('order_employees', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  orderId: integer('order_id').references(() => orders.id, { onDelete: 'cascade' }).notNull(),
  employeeId: integer('employee_id').notNull(),
  createdAt: integer('created_at', { mode: 'number' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'number' }),
  deletedAt: integer('deleted_at', { mode: 'number' }),
})

export const orderEmployeesRelations = relations(orderEmployees, ({ one }) => ({
  order: one(orders, {
    fields: [orderEmployees.orderId],
    references: [orders.id],
    relationName: 'order.orderEmployees',
  }),
  employee: one(employees, {
    fields: [orderEmployees.employeeId],
    references: [employees.id],
    relationName: 'employee.orderEmployees',
  }),
}))