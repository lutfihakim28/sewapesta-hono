import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { timestamps } from './timestamps.helper';
import { products } from './products';

export const packages = sqliteTable('packages', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  price: integer('price').notNull(),
  productId: integer('product_id').references(() => products.id).notNull(),
  ...timestamps,
}, (table) => ([
  index('package_price_index').on(table.price),
  index('package_product_index').on(table.productId),
]))