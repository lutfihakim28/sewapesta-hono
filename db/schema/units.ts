import { timestamps } from 'db/schema/timestamps.helper';
import { int, mysqlTable, varchar } from 'drizzle-orm/mysql-core';

export const units = mysqlTable('units', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 20 }).notNull(),
  ...timestamps,
})