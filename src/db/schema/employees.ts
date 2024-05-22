import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { categoriesTable } from './categories';
import { accountsTable } from './accounts';

export const employeesTable = sqliteTable('employees', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  name: text('name', { length: 100 }).notNull(),
  phone: text('phone', { length: 14 }).notNull(),
  categoryId: integer('category_id', { mode: 'number' }).references(() => categoriesTable.id),
  accountId: integer('account_id', { mode: 'number' }).references(() => accountsTable.id).notNull(),
  deletedAt: integer('deleted_at', { mode: 'timestamp' }),
})