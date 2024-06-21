import { relations } from 'drizzle-orm';
import { integer, sqliteTable } from 'drizzle-orm/sqlite-core';
import { ordersTable } from './orders';
import { employeesTable } from './employees';

export const orderEmployeesTable = sqliteTable('order_employees', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  orderId: integer('order_id').notNull(),
  employeeId: integer('employee_id').notNull(),
  createdAt: integer('created_at', { mode: 'number' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'number' }),
  deletedAt: integer('deleted_at', { mode: 'number' }),
})

export const orderEmployeesRelations = relations(orderEmployeesTable, ({ one }) => ({
  order: one(ordersTable, {
    fields: [orderEmployeesTable.orderId],
    references: [ordersTable.id],
    relationName: 'order.orderEmployees',
  }),
  employee: one(employeesTable, {
    fields: [orderEmployeesTable.employeeId],
    references: [employeesTable.id],
    relationName: 'employee.orderEmployees',
  }),
}))