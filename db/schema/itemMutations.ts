import { ItemMutationTypeEnum } from '@/lib/enums/ItemMutationType.Enum';
import { timestamps } from 'db/schema/timestamps.helper';
import { items } from 'db/schema/items';
import { index, int, mysqlTable, text, varchar } from 'drizzle-orm/mysql-core';

export const itemMutations = mysqlTable('item_mutations', {
  id: int('id').primaryKey().autoincrement(),
  type: varchar('type', {
    length: 10,
    enum: [
      ItemMutationTypeEnum.Addition,
      ItemMutationTypeEnum.Reduction,
      ItemMutationTypeEnum.Adjustment,
    ],
  }).default(ItemMutationTypeEnum.Addition),
  itemId: int('item_id').references(() => items.id).notNull(),
  quantity: int('quantity').notNull(),
  description: text('description'),
  ...timestamps,
}, () => [
  mutationItemIndex,
  mutationTypeIndex
])
export const mutationTypeIndex = index('mutation_type_index').on(itemMutations.type);
export const mutationItemIndex = index('mutation_item_index').on(itemMutations.itemId);