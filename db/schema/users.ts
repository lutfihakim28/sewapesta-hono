import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

export const usersTable = sqliteTable('users', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  username: text('username', { mode: 'text' }).notNull().unique(),
  password: text('password', { mode: 'text' }).notNull(),
})

export const usersRelations = relations(usersTable, ({ one }) => ({
}))