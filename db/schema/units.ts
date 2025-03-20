import { timestamps } from 'db/schema/timestamps.helper';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const units = sqliteTable('units', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull().unique(),
  ...timestamps,
})