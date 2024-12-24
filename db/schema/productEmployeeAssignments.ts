import { integer, sqliteTable } from 'drizzle-orm/sqlite-core';
import { orderedProducts } from './orderedProducts';
import { relations } from 'drizzle-orm';
import { employees } from './employees';

export const productEmployeeAssignments = sqliteTable('product_employee_assignments', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  orderedProductId: integer('ordered_product_id').references(() => orderedProducts.id, { onDelete: 'cascade' }).notNull(),
  employeeId: integer('employee_id').references(() => employees.id, { onDelete: 'cascade' }).notNull(),
  deletedAt: integer('deleted_at', { mode: 'number' }),
})

export const productEmployeeAssignmentsRelations = relations(productEmployeeAssignments, ({ one }) => ({
  orderedProduct: one(orderedProducts, {
    fields: [productEmployeeAssignments.orderedProductId],
    references: [orderedProducts.id],
    relationName: 'orderedProduct.productEmployeeAssignments',
  }),
  employee: one(employees, {
    fields: [productEmployeeAssignments.employeeId],
    references: [employees.id],
    relationName: 'employee.productEmployeeAssignments',
  }),
}));