import { char, index, integer, pgTable, serial, text, varchar } from 'drizzle-orm/pg-core';
import { units } from './units';
import { categories } from 'db/schema/categories';
import { timestamps } from "db/schema/timestamps.helper";
import { ItemTypeEnum } from '@/utils/enums/ItemTypeEnum';

export const items = pgTable('items', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  unitId: integer('unit_id').references(() => units.id).notNull(),
  categoryId: integer('category_id').references(() => categories.id).notNull(),
  type: char('type', {
    enum: [
      ItemTypeEnum.Equipment,
      ItemTypeEnum.Inventory,
    ],
    length: 9
  }).notNull().default(ItemTypeEnum.Equipment),
  ...timestamps,
}, (table) => [
  index('item_category_index').on(table.categoryId),
])
