import { timestamps } from 'db/schema/timestamps.helper';
import { orderEmployees } from 'db/schema/orderEmployees';
import { productEmployeeAssignments } from 'db/schema/productEmployeeAssignments';
import { relations } from 'drizzle-orm';
import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const employees = sqliteTable('employees', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name', { length: 100 }).notNull(),
  phone: text('phone', { length: 14 }).notNull(),
  ...timestamps,
})

export const employeesRelations = relations(employees, ({ many }) => ({
  orderEmployees: many(orderEmployees),
  productEmployeeAssignments: many(productEmployeeAssignments),
}));