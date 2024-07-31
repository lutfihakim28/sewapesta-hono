import { OrderStatusEnum } from '@/enums/OrderStatusEnum';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const ordersTable = sqliteTable('orders', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  number: text('number').notNull().unique(),
  customerName: text('customer_name').notNull(),
  customerPhone: text('customer_phone').notNull(),
  customerAddress: text('customer_address').notNull(),
  note: text('note'),
  status: text('status', {
    enum: [
      OrderStatusEnum.Created,
      OrderStatusEnum.Done,
      OrderStatusEnum.Event,
      OrderStatusEnum.Loading,
      OrderStatusEnum.Unloading,
    ],
  }),
  startDate: integer('start_date', { mode: 'number' }).notNull(),
  endDate: integer('end_date', { mode: 'number' }).notNull(),
  createdAt: integer('created_at', { mode: 'number' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'number' }),
  deletedAt: integer('deleted_at', { mode: 'number' }),
});