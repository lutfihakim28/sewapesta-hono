import { timestamps } from 'db/schema/timestamps.helper';
import { integer, pgTable, serial, text } from 'drizzle-orm/pg-core';

export const units = pgTable('units', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  ...timestamps,
})