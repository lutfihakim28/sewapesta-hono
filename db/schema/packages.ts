import { index, integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { timestamps } from './timestamps.helper';
import { products } from './products';
import { users } from './users';
import { PackageTermEnum } from '@/utils/enums/PackageTermEnum';

export const packages = sqliteTable('packages', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  ownerId: integer('owner_id').references(() => users.id).notNull(),
  productId: integer('product_id').references(() => products.id),
  price: integer('price').notNull(),
  ownerPrice: integer('owner_price'), // exac amount. e.g. 200.000
  ownerRatio: real('owner_ratio'), // ratio from price. e.g. 50% => 0.5
  term: text('term', { enum: [PackageTermEnum.Price, PackageTermEnum.Ratio] }).notNull(),
  includeEmployee: integer('include_employee', { mode: 'boolean' }), // if true, employees who responsible for send/retrieve this item are handled by the owner
  ...timestamps,
}, (table) => ([
  index('package_owner_index').on(table.ownerId),
  index('package_product_index').on(table.productId),
  index('package_price_index').on(table.price),
  index('package_owner_price_index').on(table.ownerPrice),
  index('package_owner_ratio_index').on(table.ownerRatio),
  index('package_include_employee_index').on(table.includeEmployee),
]))