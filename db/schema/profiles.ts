import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { timestamps } from './timestamps.helper';
import { relations } from 'drizzle-orm';
import { users } from './users';

export const profiles = sqliteTable('profiles', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  phone: text('phone').notNull(),
  ...timestamps,
})

export const profilesRelations = relations(profiles, ({ one }) => ({
  user: one(users)
}))