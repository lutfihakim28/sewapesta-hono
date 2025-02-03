import { relations } from 'drizzle-orm';
import { integer, real, sqliteTable } from 'drizzle-orm/sqlite-core';
import { orders } from './orders';
import { units } from './units';
import { products } from './products';
import { productEmployeeAssignments } from './productEmployeeAssignments';

export const orderedProducts = sqliteTable('ordered_products', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  productId: integer('product_id').references(() => products.id, { onDelete: 'cascade' }).notNull(),
  orderId: integer('order_id').references(() => orders.id, { onDelete: 'cascade' }).notNull(),
  baseQuantity: integer('base_quantity').notNull(),
  orderedQuantity: integer('ordered_quantity').notNull(),
  orderedUnitId: integer('ordered_unit').notNull(),
  price: real('price').notNull().default(0),
  deletedAt: integer('deleted_at'),
})

export const orderedProductsRelations = relations(orderedProducts, ({ one, many }) => ({
  product: one(products, {
    fields: [orderedProducts.productId],
    references: [products.id],
  }),
  order: one(orders, {
    fields: [orderedProducts.orderId],
    references: [orders.id],
  }),
  orderedUnit: one(units, {
    fields: [orderedProducts.orderedUnitId],
    references: [units.id],
  }),
  assignedEmployees: many(productEmployeeAssignments)
}));