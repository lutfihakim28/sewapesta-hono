import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { accountsTable } from './accounts';

export const ownersTable = sqliteTable('owners', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  phone: text('phone').notNull(),
  accountId: integer('account_id', { mode: 'number' }).references(() => accountsTable.id).notNull(),
  deletedAt: integer('deleted_at', { mode: 'timestamp' }),
})