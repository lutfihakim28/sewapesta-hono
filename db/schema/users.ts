import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  username: text('username', { mode: 'text' }).notNull().unique(),
  password: text('password', { mode: 'text' }).notNull(),
})