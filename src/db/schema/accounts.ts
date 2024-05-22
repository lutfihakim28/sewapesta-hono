import { relations } from 'drizzle-orm';
import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { usersTable } from './users';
import { employeesTable } from './employees';

export const accountsTable = sqliteTable('accounts', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  balance: real('balance').default(0),
  name: text('name', { length: 100 }).notNull(),
  deletedAt: integer('deleted_at', { mode: 'timestamp' }),
})

export const accountsRelations = relations(accountsTable, ({ one }) => ({
  user: one(usersTable),
  employee: one(employeesTable),
}))