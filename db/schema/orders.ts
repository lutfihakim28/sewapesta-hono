import { OrderStatusEnum } from '@/lib/enums/OrderStatusEnum';
import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { orderedProducts } from './orderedProducts';
import { orderEmployees } from './orderEmployees';

export const orders = sqliteTable('orders', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  number: text('number').notNull().unique(),
  customerName: text('customer_name').notNull(),
  customerPhone: text('customer_phone').notNull(),
  customerAddress: text('customer_address').notNull(),
  note: text('note'),
  status: text('status', {
    enum: [
      OrderStatusEnum.Cancel,
      OrderStatusEnum.Created,
      OrderStatusEnum.Done,
      OrderStatusEnum.Event,
      OrderStatusEnum.Loading,
      OrderStatusEnum.Unloading,
    ],
  }).default(OrderStatusEnum.Created),
  middleman: integer('middleman', { mode: 'boolean' }).default(false),
  overtime: integer('overtime').default(0),
  startDate: integer('start_date').notNull(),
  endDate: integer('end_date').notNull(),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at'),
  deletedAt: integer('deleted_at'),
});

export const ordersRelations = relations(orders, ({ many }) => ({
  orderedProducts: many(orderedProducts),
  orderEmployees: many(orderEmployees)
}))