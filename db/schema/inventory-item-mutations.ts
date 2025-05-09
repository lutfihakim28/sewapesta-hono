import { StockMutationTypeEnum } from '@/lib/enums/StockMutationType.Enum';
import { timestamps } from 'db/schema/timestamps.helper';
import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import dayjs from 'dayjs';
import { inventoryItems } from './inventory-items';
import { items } from './items';

export const inventoryItemMutations = sqliteTable('inventory_item_mutations', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  type: text('type', {
    enum: [
      StockMutationTypeEnum.Addition,
      StockMutationTypeEnum.Reduction,
      StockMutationTypeEnum.Adjustment,
    ],
  }).notNull().default(StockMutationTypeEnum.Addition),
  itemId: integer('item_id').references(() => items.id).notNull(),
  inventoryItemId: integer('inventory_item_id').references(() => inventoryItems.id).notNull(),
  quantity: integer('quantity').notNull(),
  description: text('description'),
  mutateAt: integer('mutate_at').notNull().$defaultFn(() => dayjs().unix()),
  ...timestamps,
}, (table) => [
  index('mutation_type_index').on(table.type),
  index('mutation_item_index').on(table.itemId),
  index('mutation_inventory_item_index').on(table.inventoryItemId)
])