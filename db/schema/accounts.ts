import { relations } from 'drizzle-orm';
import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { usersTable } from './users';
import { employeesTable } from './employees';
import { ownersTable } from './owners';
import { accountMutationsTable } from './accountMutations';

export const accountsTable = sqliteTable('accounts', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  name: text('name', { length: 100 }).notNull(),
  balance: real('balance').notNull().default(0),
  bank: text('bank'),
  number: text('number'),
  isPayment: integer('is_payment', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at', { mode: 'number' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'number' }),
  deletedAt: integer('deleted_at', { mode: 'number' }),
})

export const accountsRelations = relations(accountsTable, ({ one, many }) => ({
  user: one(usersTable),
  employee: one(employeesTable),
  owner: one(ownersTable),
  mutations: many(accountMutationsTable, {
    relationName: 'account.mutations'
  })
}))