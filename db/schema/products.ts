import { branches } from 'db/schema/branches';
import { timestamps } from 'db/schema/timestamps.helper';
import { int, mysqlTable, varchar } from 'drizzle-orm/mysql-core';

export const products = mysqlTable('products', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 150 }).notNull(),
  rentalTimeIncrement: int('rental_time_increment').notNull(), // Base time in minute
  branchId: int('branch').references(() => branches.id).notNull(),
  ...timestamps,
})