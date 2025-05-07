import { OvertimeTypeEnum } from '@/lib/enums/OvertimeTypeEnum';
import { index, integer, primaryKey, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { timestamps } from './timestamps.helper';

export const equipmentItemsProducts = sqliteTable('equipment_items_products', {
  equipmentItemId: integer('equipment_item_id').notNull(),
  productId: integer('product_id').notNull(),
  price: integer('price').notNull().default(0),
  overtimePrice: integer('overtime_price').notNull().default(0), // Exact amount per hour. e.g. 100.000 / hour
  overtimeRatio: real('overtime_ratio').notNull().default(0), // Multiplier from price per hour.
  overtimeType: text('overtime_type', {
    enum: [
      OvertimeTypeEnum.Price,
      OvertimeTypeEnum.Ratio,
    ]
  }).notNull().default(OvertimeTypeEnum.Price),
  ...timestamps,
}, (table) => ([
  primaryKey({ columns: [table.equipmentItemId, table.productId] }),
  index('equipment_item_product_overtime_type_index').on(table.overtimeType),
  index('equipment_item_product_price_index').on(table.price),
  index('equipment_item_product_overtime_price_index').on(table.overtimePrice),
  index('equipment_item_product_overtime_ratio_index').on(table.overtimeRatio),
]))