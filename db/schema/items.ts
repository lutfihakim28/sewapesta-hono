import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { units } from './units';
import { categories } from 'db/schema/categories';
import { timestamps } from "db/schema/timestamps.helper";
import { ItemTypeEnum } from '@/lib/enums/ItemTypeEnum';

export const items = sqliteTable('items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull().unique(),
  unitId: integer('unit_id').references(() => units.id).notNull(),
  categoryId: integer('category_id').references(() => categories.id).notNull(),
  type: text('type', {
    enum: [
      ItemTypeEnum.Equipment,
      ItemTypeEnum.Inventory,
    ]
  }).notNull().default(ItemTypeEnum.Equipment),
  ...timestamps,
}, (table) => [
  index('item_category_index').on(table.categoryId),
])
