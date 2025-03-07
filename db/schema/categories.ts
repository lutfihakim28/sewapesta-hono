import { timestamps } from "db/schema/timestamps.helper";
import { int, mysqlTable, varchar } from 'drizzle-orm/mysql-core';

export const categories = mysqlTable('categories', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 100 }).notNull(),
  ...timestamps,
})