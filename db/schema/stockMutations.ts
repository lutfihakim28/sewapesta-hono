import { StockMutationTypeEnum } from '@/enums/StockMutationTypeEnum';
import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { items } from './items';

export const stockMutations = sqliteTable('stock_mutations', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  type: text('type', {
    enum: [
      StockMutationTypeEnum.Addition,
      StockMutationTypeEnum.Reduction,
    ],
  }).default(StockMutationTypeEnum.Addition),
  itemId: integer('item_id').notNull(),
  orderId: integer('order_id').notNull(),
  quantity: integer('quantity').notNull(),
  note: text('note'),
  createdAt: integer('created_at', { mode: 'number' }).notNull(),
})

export const stockMutationsRelations = relations(stockMutations, ({ one }) => ({
  item: one(items, {
    fields: [stockMutations.itemId],
    references: [items.id],
    relationName: 'item.stockMutations',
  }),
}))