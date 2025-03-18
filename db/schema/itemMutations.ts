import { ItemMutationTypeEnum } from '@/lib/enums/ItemMutationType.Enum';
import { timestamps } from 'db/schema/timestamps.helper';
import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { items } from 'db/schema/items';

export const itemMutations = sqliteTable('item_mutations', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  type: text('type', {
    enum: [
      ItemMutationTypeEnum.Addition,
      ItemMutationTypeEnum.Reduction,
      ItemMutationTypeEnum.Adjustment,
    ],
  }).default(ItemMutationTypeEnum.Addition),
  itemId: integer('item_id').references(() => items.id).notNull(),
  quantity: integer('quantity').notNull(),
  description: text('description'),
  ...timestamps,
}, () => [
  mutationItemIndex,
  mutationTypeIndex
])
export const mutationTypeIndex = index('mutation_type_index').on(itemMutations.type);
export const mutationItemIndex = index('mutation_item_index').on(itemMutations.itemId);