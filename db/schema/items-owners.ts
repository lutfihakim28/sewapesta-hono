import { index, integer, sqliteTable } from 'drizzle-orm/sqlite-core';
import { items } from './items';
import { users } from './users';
import { timestamps } from './timestamps.helper';

export const itemsOwners = sqliteTable('items_owners', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  itemId: integer('item_id').references(() => items.id).notNull(),
  ownerId: integer('owner_id').references(() => users.id).notNull(),
  ...timestamps,
}, (table) => [
  index('item_owner_owner_index').on(table.ownerId),
  index('item_owner_item_index').on(table.itemId)
])