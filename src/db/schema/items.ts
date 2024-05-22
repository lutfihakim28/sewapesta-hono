import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { subCategoriesTable } from './subCategories';
import { ownersTable } from './owners';
import { ItemStatusEnum } from '@/enums/ItemStatusEnum';

export const itemsTable = sqliteTable('items', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  quantity: integer('quantity', { mode: 'number' }).default(1),
  unit: text('unit').default('pcs'),
  price: real('price').notNull(),
  status: text('status', {
    enum: [
      ItemStatusEnum.InUse,
      ItemStatusEnum.Maintenance,
      ItemStatusEnum.Ready,
    ]
  }).notNull().default(ItemStatusEnum.Ready),
  subCategoryId: integer('sub_category_id', { mode: 'number' }).references(() => subCategoriesTable.id).notNull(),
  ownerId: integer('owner_id', { mode: 'number' }).references(() => ownersTable.id).notNull(),
  deletedAt: integer('deleted_at', { mode: 'timestamp' }),
})