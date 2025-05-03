import { StockMutationTypeEnum } from '@/lib/enums/StockMutationType.Enum';
import { timestamps } from 'db/schema/timestamps.helper';
import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { itemsOwners } from './items-owners';
import dayjs from 'dayjs';

export const stockMutations = sqliteTable('stock_mutations', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  type: text('type', {
    enum: [
      StockMutationTypeEnum.Addition,
      StockMutationTypeEnum.Reduction,
      StockMutationTypeEnum.Adjustment,
    ],
  }).notNull().default(StockMutationTypeEnum.Addition),
  itemOwnerId: integer('item_owner_id').references(() => itemsOwners.id).notNull(),
  quantity: integer('quantity').notNull(),
  affectItemQuantity: integer('affect_item_quantity', { mode: 'boolean' }).default(false),
  description: text('description'),
  mutateAt: integer('mutate_at').notNull().$defaultFn(() => dayjs().unix()),
  ...timestamps,
}, (table) => [
  index('mutation_type_index').on(table.type),
  index('mutation_item_owner_index').on(table.itemOwnerId)
])