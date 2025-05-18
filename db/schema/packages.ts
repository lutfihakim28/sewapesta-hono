import { index, integer, real, pgTable, text, serial, boolean, bigint, decimal } from 'drizzle-orm/pg-core';
import { timestamps } from './timestamps.helper';
import { products } from './products';
import { users } from './users';
import { PackageTermEnum } from '@/utils/enums/PackageTermEnum';

export const packages = pgTable('packages', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  ownerId: integer('owner_id').references(() => users.id).notNull(),
  productId: integer('product_id').references(() => products.id),
  price: bigint('price', { mode: 'number' }).notNull(),
  ownerPrice: bigint('owner_price', { mode: 'number' }).notNull(), // exac amount. e.g. 200.000
  ownerRatio: decimal('owner_ratio', { precision: 5, scale: 2 }), // ratio from price. e.g. 50% => 0.5
  term: text('term', { enum: [PackageTermEnum.Price, PackageTermEnum.Ratio] }).notNull(),
  includeEmployee: boolean('include_employee'), // if true, employees who responsible for send/retrieve this item are handled by the owner
  ...timestamps,
}, (table) => ([
  index('package_owner_index').on(table.ownerId),
  index('package_product_index').on(table.productId),
  index('package_price_index').on(table.price),
  index('package_owner_price_index').on(table.ownerPrice),
  index('package_owner_ratio_index').on(table.ownerRatio),
  index('package_include_employee_index').on(table.includeEmployee),
]))