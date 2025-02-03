import { timestamps } from 'db/schema/timestamps.helper';
import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';
import { OwnerTypeEnum } from '@/enums/OwnerTypeEnum';
import { items } from 'db/schema/items';

export const owners = sqliteTable('owners', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  phone: text('phone').notNull(),
  type: text('type', {
    enum: [
      OwnerTypeEnum.Corporation,
      OwnerTypeEnum.Individu,
    ]
  }).default(OwnerTypeEnum.Individu),
  ...timestamps,
}, (table) => ({
  ownerTypeIndex: index('owners_type_index').on(table.type),
}))

export const ownersRelations = relations(owners, ({ many }) => ({
  items: many(items),
}))