import { integer, primaryKey, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { OvertimeTypeEnum } from '@/lib/enums/OvertimeTypeEnum';
import { items } from './items';
import { products } from './products';

export const productsItems = sqliteTable('product_items', {
  itemId: integer('item_id').references(() => items.id).notNull(),
  productId: integer('product_id').references(() => products.id).notNull(),
  overtimePrice: integer('overtime_price').notNull().default(0), // Exact amount per hour. e.g. 100.000 / hour
  overtimeRatio: real('overtime_ratio').notNull().default(0), // Ratio based on total price.
  overtimeMultiplier: real('overtime_multiplier').notNull().default(0), // Multiplier from price per hour.
  overtimeType: text('overtime_type', {
    enum: [
      OvertimeTypeEnum.Multiplier,
      OvertimeTypeEnum.Price,
      OvertimeTypeEnum.Ratio,
    ]
  }).notNull().default(OvertimeTypeEnum.Price)
}, (table) => ([
  primaryKey({ columns: [table.itemId, table.productId] })
]))