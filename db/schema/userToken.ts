import dayjs from 'dayjs';
import { integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const userToken = sqliteTable('user_tokens', {
  userId: integer('user_id').unique(),
  token: text('token').unique(),
  lastLogin: integer('last_login').notNull().$defaultFn(() => dayjs().unix()).$onUpdateFn(() => dayjs().unix())
}, (table) => ({
  primaryKey: primaryKey({ columns: [table.userId, table.token] })
}))