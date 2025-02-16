import { branches } from 'db/schema/branches';
import { productsItems } from 'db/schema/productsItems';
import { timestamps } from 'db/schema/timestamps.helper';
import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const products = sqliteTable('products', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  rentalTimeIncrement: integer('rental_time_increment').notNull(), // Base time in hour
  branchId: integer('branch').references(() => branches.id).notNull(),
  ...timestamps,
})

export const productsRelations = relations(products, ({ one, many }) => ({
  branch: one(branches, {
    fields: [products.branchId],
    references: [branches.id],
  }),
  items: many(productsItems),
}))