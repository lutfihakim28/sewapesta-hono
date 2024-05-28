import { AccountMutationTypeEnum } from '@/enums/AccountMutationTypeEnum';
import { relations } from 'drizzle-orm';
import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { accountsTable } from './accounts';

export const accountMutationsTable = sqliteTable('account_mutations', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  type: text('type', {
    enum: [
      AccountMutationTypeEnum.Debit,
      AccountMutationTypeEnum.Credit,
    ]
  }).notNull(),
  amount: real('amount').notNull().default(0),
  accountId: integer('account_id').notNull(),
  description: text('description'),
  createdAt: integer('created_at', { mode: 'number' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'number' }),
  deletedAt: integer('deleted_at', { mode: 'number' }),
})

export const accountMutationsRelations = relations(accountMutationsTable, ({ one }) => ({
  account: one(accountsTable, {
    fields: [accountMutationsTable.accountId],
    references: [accountsTable.id],
    relationName: 'account.mutations'
  }),
}))