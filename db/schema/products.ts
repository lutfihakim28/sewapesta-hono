import { relations } from 'drizzle-orm';
import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { productItems } from './productItems';

export const products = sqliteTable('products', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  overtimeRatio: real('overtime_ratio'),
  price: real('price').notNull().default(0),
  createdAt: integer('created_at', { mode: 'number' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'number' }),
  deletedAt: integer('deleted_at', { mode: 'number' }),
})

export const productsRelations = relations(products, ({ many }) => ({
  productItems: many(productItems, {
    relationName: 'product.productItems'
  })
}))