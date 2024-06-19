import { PaymentTypeEnum } from '@/enums/PaymentTypeEnum';
import { relations } from 'drizzle-orm';
import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { ordersTable } from './orders';

export const paymentsTable = sqliteTable('payments', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  number: text('number').notNull().unique(),
  type: text('type', {
    enum: [
      PaymentTypeEnum.DownPayment,
      PaymentTypeEnum.Repayment,
    ]
  }).notNull().default(PaymentTypeEnum.DownPayment),
  amount: real('amount').notNull(),
  orderId: integer('order_id').notNull(),
  payedAt: integer('payed_at', { mode: 'number' }).notNull(),
  createdAt: integer('created_at', { mode: 'number' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'number' }),
  deletedAt: integer('deleted_at', { mode: 'number' }),
})

export const paymentsRelations = relations(paymentsTable, ({ one }) => ({
  order: one(ordersTable, {
    fields: [paymentsTable.orderId],
    references: [ordersTable.id],
    relationName: 'order.payments',
  })
}));