import { timestamps } from 'db/schema/timestamps.helper';
import { integer, pgTable, serial, text } from 'drizzle-orm/pg-core';

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  ...timestamps,
})