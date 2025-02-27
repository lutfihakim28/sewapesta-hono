import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { timestamps } from "db/schema/timestamps.helper";
import { branches } from './branches';
import { relations } from 'drizzle-orm';

export const categories = sqliteTable('categories', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  branchId: integer('branch_id').references(() => branches.id, { onDelete: 'cascade' }).notNull(),
  ...timestamps,
})

export const categoriesRelations = relations(categories, ({ one }) => ({
  branch: one(branches, {
    fields: [categories.branchId],
    references: [branches.id]
  })
}))