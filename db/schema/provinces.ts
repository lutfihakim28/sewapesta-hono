import { mysqlTable, varchar } from 'drizzle-orm/mysql-core';

export const provinces = mysqlTable('provinces', {
  code: varchar('code', { length: 2 }).primaryKey(),
  name: varchar('name', { length: 150 }).notNull(),
})