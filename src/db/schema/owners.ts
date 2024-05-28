import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { accountsTable } from './accounts';
import { relations } from 'drizzle-orm';

export const ownersTable = sqliteTable('owners', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  phone: text('phone').notNull(),
  accountId: integer('account_id', { mode: 'number' }).notNull(),
  createdAt: integer('created_at', { mode: 'number' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'number' }),
  deletedAt: integer('deleted_at', { mode: 'number' }),
})

export const ownersRelations = relations(ownersTable, ({ one }) => ({
  account: one(accountsTable, {
    fields: [ownersTable.accountId],
    references: [accountsTable.id],
    relationName: 'account.owner'
  }),
}))