import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { timestamps } from './timestamps.helper';
import { items } from './items';
import { users } from './users';
import { TermPriceTypeEnum } from '@/utils/enums/TermPriceTypeEnum';

export const itemRevenueTerms = sqliteTable('item_revenue_terms', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  itemId: integer('item_id').references(() => items.id).notNull(),
  ownerId: integer('owner_id').references(() => users.id).notNull(),
  ownerFixedPrice: integer('owner_fix_price'),
  ownerRatioPrice: real('owner_ratio_price'),
  employeeFixedPrice: integer('employee_fix_price'),
  employeeRatioPrice: real('employee_ratio_price'),
  ownerPriceType: text('owner_price_type', { enum: [TermPriceTypeEnum.Fixed, TermPriceTypeEnum.Ratio] }).notNull(),
  employeePriceType: text('employee_price_type', { enum: [TermPriceTypeEnum.Fixed, TermPriceTypeEnum.Ratio] }).notNull(),
  ...timestamps,
})