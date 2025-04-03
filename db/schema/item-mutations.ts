import { ItemMutationTypeEnum } from '@/lib/enums/ItemMutationType.Enum';
import { timestamps } from 'db/schema/timestamps.helper';
import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { itemsOwners } from './items-owners';

export const itemMutations = sqliteTable('item_mutations', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  type: text('type', {
    enum: [
      ItemMutationTypeEnum.Addition,
      ItemMutationTypeEnum.Reduction,
      ItemMutationTypeEnum.Adjustment,
    ],
  }).notNull().default(ItemMutationTypeEnum.Addition),
  itemOwnerId: integer('item_owner_id').references(() => itemsOwners.id).notNull(),
  quantity: integer('quantity').notNull(),
  affectItemQuantity: integer('affect_item_quantity', { mode: 'boolean' }).default(false),
  description: text('description'),
  ...timestamps,
}, (table) => [
  index('mutation_type_index').on(table.type),
  index('mutation_item_owner_index').on(table.itemOwnerId)
])