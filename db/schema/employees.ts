import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';
import { orderEmployees } from './orderEmployees';
import { productEmployeeAssignments } from './productEmployeeAssignments';

export const employees = sqliteTable('employees', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  name: text('name', { length: 100 }).notNull(),
  phone: text('phone', { length: 14 }).notNull(),
  createdAt: integer('created_at', { mode: 'number' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'number' }),
  deletedAt: integer('deleted_at', { mode: 'number' }),
})

export const employeesRelations = relations(employees, ({ many }) => ({
  orderEmployees: many(orderEmployees, {
    relationName: 'employee.orderEmployees'
  }),
  productEmployeeAssignments: many(productEmployeeAssignments, {
    relationName: 'employee.productEmployeeAssignments'
  })
}))