import { branches } from 'db/schema/branches';
import { timestamps } from 'db/schema/timestamps.helper';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const products = sqliteTable('products', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  rentalTimeIncrement: integer('rental_time_increment').notNull(), // Base time in hour
  branchId: integer('branch_id').references(() => branches.id).notNull(),
  ...timestamps,
})