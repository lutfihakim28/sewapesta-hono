import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { usersTable } from './users';
import { employeesTable } from './employees';
import { ownersTable } from './owners';

export const accountsTable = sqliteTable('accounts', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  name: text('name', { length: 100 }).notNull(),
  createdAt: integer('created_at', { mode: 'number' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'number' }),
  deletedAt: integer('deleted_at', { mode: 'number' }),
})

export const accountsRelations = relations(accountsTable, ({ one }) => ({
  user: one(usersTable),
  employee: one(employeesTable),
  owner: one(ownersTable),
}))