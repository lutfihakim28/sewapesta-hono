import { OvertimeTypeEnum } from '@/lib/enums/OvertimeTypeEnum';
import { decimal, int, mysqlTable, primaryKey, varchar } from 'drizzle-orm/mysql-core';
import { items } from './items';
import { products } from './products';

export const productsItems = mysqlTable('product_items', {
  itemId: int('item_id').references(() => items.id).notNull(),
  productId: int('product_id').references(() => products.id).notNull(),
  overtimePrice: decimal('overtime_price', { precision: 15, scale: 2 }).default('0'), // Exact amount per hour. e.g. 100.000 / hour
  overtimeRatio: decimal('overtime_ratio', { precision: 4, scale: 2 }).default('0'), // Ratio based on total price.
  overtimeMultiplier: decimal('overtime_multiplier', { precision: 4, scale: 2 }).default('0'), // Multiplier from price per hour.
  overtimeType: varchar('overtime_type', {
    length: 10,
    enum: [
      OvertimeTypeEnum.Multiplier,
      OvertimeTypeEnum.Price,
      OvertimeTypeEnum.Ratio,
    ]
  }).default(OvertimeTypeEnum.Price)
}, (table) => ([
  primaryKey({ columns: [table.itemId, table.productId] })
]))