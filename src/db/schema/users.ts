import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { accountsTable } from './accounts';
import { relations } from 'drizzle-orm';

export const usersTable = sqliteTable('users', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  username: text('username', { mode: 'text' }).notNull().unique(),
  password: text('password', { mode: 'text' }).notNull(),
  accountId: integer('account_id').notNull(),
})

export const usersRelations = relations(usersTable, ({ one }) => ({
  account: one(accountsTable, {
    fields: [usersTable.accountId],
    references: [accountsTable.id],
  }),
}))