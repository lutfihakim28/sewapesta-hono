import { integer, pgTable, serial, text } from 'drizzle-orm/pg-core';
import { timestamps } from "db/schema/timestamps.helper";

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: text('username').notNull().unique(),
  password: text('password').notNull(),
  refreshToken: text('refresh_token').unique(),
  ...timestamps,
})
