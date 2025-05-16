import { StockMutationTypeEnum } from '@/utils/enums/StockMutationType.Enum';
import { timestamps } from 'db/schema/timestamps.helper';
import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { inventories } from './inventories';
import { items } from './items';
import { AppDate } from '@/utils/libs/AppDate';

export const inventoryMutations = sqliteTable('inventory_mutations', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  type: text('type', {
    enum: [
      StockMutationTypeEnum.Addition,
      StockMutationTypeEnum.Reduction,
      StockMutationTypeEnum.Adjustment,
    ],
  }).notNull().default(StockMutationTypeEnum.Addition),
  itemId: integer('item_id').references(() => items.id).notNull(),
  inventoryId: integer('inventory_id').references(() => inventories.id).notNull(),
  quantity: integer('quantity').notNull(),
  description: text('description'),
  mutateAt: integer('mutate_at').notNull().$defaultFn(() => new AppDate().unix),
  ...timestamps,
}, (table) => [
  index('mutation_type_index').on(table.type),
  index('mutation_item_index').on(table.itemId),
  index('mutation_inventory_index').on(table.inventoryId)
])