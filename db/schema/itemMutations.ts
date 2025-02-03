import { ItemMutationTypeEnum } from '@/enums/ItemMutationType.Enum';
import { timestamps } from 'db/schema/timestamps.helper';
import { relations } from 'drizzle-orm';
import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { items } from 'db/schema/items';
import { orders } from './orders';

export const itemMutations = sqliteTable('item_mutations', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  type: text('type', {
    enum: [
      ItemMutationTypeEnum.Addition,
      ItemMutationTypeEnum.Reduction,
      ItemMutationTypeEnum.Adjustment,
    ],
  }).default(ItemMutationTypeEnum.Addition),
  itemId: integer('item_id').references(() => items.id, { onDelete: 'cascade' }).notNull(),
  quantity: integer('quantity').notNull(),
  description: text('description'),
  ...timestamps,
}, (table) => ({
  mutationTypeIndex: index('mutation_type_index').on(table.type),
  mutationItemIndex: index('mutation_item_index').on(table.itemId),
}))

export const stockMutationsRelations = relations(itemMutations, ({ one }) => ({
  item: one(items, {
    fields: [ itemMutations.itemId],
    references: [items.id],
  }),
}))