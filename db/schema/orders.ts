import { OrderStatusEnum } from '@/enums/OrderStatusEnum';
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
  overtime: integer('overtime', { mode: 'number' }).default(0),
  startDate: integer('start_date', { mode: 'number' }).notNull(),
  endDate: integer('end_date', { mode: 'number' }).notNull(),
  createdAt: integer('created_at', { mode: 'number' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'number' }),
  deletedAt: integer('deleted_at', { mode: 'number' }),
});

export const ordersRelations = relations(orders, ({ many }) => ({
  orderedProducts: many(orderedProducts, {
    relationName: 'order.orderedProducts'
  }),
  orderEmployees: many(orderEmployees, {
    relationName: 'order.orderEmployees'
  })
}))