import { integer, sqliteTable } from 'drizzle-orm/sqlite-core';
import { orderedProducts } from './orderedProducts';
import { relations } from 'drizzle-orm';
import { users } from './users';

export const productEmployeeAssignments = sqliteTable('product_employee_assignments', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  orderedProductId: integer('ordered_product_id').references(() => orderedProducts.id).notNull(),
  employeeId: integer('employee_id').references(() => users.id).notNull(),
  deletedAt: integer('deleted_at'),
})

export const productEmployeeAssignmentsRelations = relations(productEmployeeAssignments, ({ one }) => ({
  employee: one(users, {
    fields: [productEmployeeAssignments.employeeId],
    references: [users.id],
  }),
  orderedProduct: one(orderedProducts, {
    fields: [productEmployeeAssignments.orderedProductId],
    references: [orderedProducts.id],
  }),
}));