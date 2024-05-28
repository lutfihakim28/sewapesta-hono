import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { accountsTable } from './accounts';
import { relations } from 'drizzle-orm';

export const employeesTable = sqliteTable('employees', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  name: text('name', { length: 100 }).notNull(),
  phone: text('phone', { length: 14 }).notNull(),
  accountId: integer('account_id', { mode: 'number' }).notNull(),
  createdAt: integer('created_at', { mode: 'number' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'number' }),
  deletedAt: integer('deleted_at', { mode: 'number' }),
})

export const employeesRelations = relations(employeesTable, ({ one }) => ({
  account: one(accountsTable, {
    fields: [employeesTable.accountId],
    references: [accountsTable.id],
    relationName: 'account.employee'
  }),
}))