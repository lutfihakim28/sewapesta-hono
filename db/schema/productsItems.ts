import { integer, primaryKey, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { OvertimeTypeEnum } from '@/lib/enums/OvertimeTypeEnum';

export const productsItems = sqliteTable('product_items', {
  itemId: integer('item_id'),
  productId: integer('product_id'),
  overtimePrice: integer('overtime_price').default(0), // Exact amount per hour. e.g. 100.000 / hour
  overtimeRatio: real('overtime_ratio').default(0), // Ratio based on total price.
  overtimeMultiplier: real('overtime_multiplier').default(0), // Multiplier from price per hour.
  overtimeType: text('overtime_type', {
    enum: [
      OvertimeTypeEnum.Multiplier,
      OvertimeTypeEnum.Price,
      OvertimeTypeEnum.Ratio,
    ]
  }).default(OvertimeTypeEnum.Price)
}, (table) => ({
  primaryKey: primaryKey({ columns: [table.itemId, table.productId] })
}))