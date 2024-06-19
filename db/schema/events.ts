import { EventTypeEnum } from '@/enums/EventTypeEnum';
import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { ordersTable } from './orders';

export const eventsTable = sqliteTable('events', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  startDate: integer('start_date', { mode: 'number' }).notNull(),
  endDate: integer('end_date', { mode: 'number' }).notNull(),
  type: text('type', {
    enum: [
      EventTypeEnum.Event,
      EventTypeEnum.Load,
      EventTypeEnum.Unload,
    ]
  }),
  orderId: integer('order_id').notNull(),
  createdAt: integer('created_at', { mode: 'number' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'number' }),
  deletedAt: integer('deleted_at', { mode: 'number' }),
})

export const eventssRelations = relations(eventsTable, ({ one }) => ({
  order: one(ordersTable, {
    fields: [eventsTable.orderId],
    references: [ordersTable.id],
    relationName: 'order.events',
  })
}));