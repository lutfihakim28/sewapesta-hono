import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { accountsTable } from './accounts';

export const usersTable = sqliteTable('users', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  username: text('username', { mode: 'text' }).notNull().unique(),
  password: text('password', { mode: 'text' }).notNull(),
  accountId: integer('account_id').references(() => accountsTable.id).notNull(),
})