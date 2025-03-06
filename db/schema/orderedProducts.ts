import { integer, real, sqliteTable } from 'drizzle-orm/sqlite-core';
import { orders } from './orders';
import { products } from './products';

export const orderedProducts = sqliteTable('ordered_products', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  productId: integer('product_id').references(() => products.id).notNull(),
  orderId: integer('order_id').references(() => orders.id).notNull(),
  baseQuantity: integer('base_quantity').notNull(),
  orderedQuantity: integer('ordered_quantity').notNull(),
  orderedUnitId: integer('ordered_unit').notNull(),
  price: real('price').notNull().default(0),
  deletedAt: integer('deleted_at'),
})