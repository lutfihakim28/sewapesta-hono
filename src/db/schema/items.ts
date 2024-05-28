import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { subcategoriesTable } from './subcategories';
import { ownersTable } from './owners';
import { ItemStatusEnum } from '@/enums/ItemStatusEnum';
import { relations } from 'drizzle-orm';

export const itemsTable = sqliteTable('items', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  quantity: integer('quantity', { mode: 'number' }).notNull().default(1),
  unit: text('unit').default('pcs'),
  price: real('price').notNull(),
  status: text('status', {
    enum: [
      ItemStatusEnum.InUse,
      ItemStatusEnum.Maintenance,
      ItemStatusEnum.Ready,
    ]
  }).notNull().default(ItemStatusEnum.Ready),
  subcategoryId: integer('subcategory_id', { mode: 'number' }).notNull(),
  ownerId: integer('owner_id', { mode: 'number' }).notNull(),
  createdAt: integer('created_at', { mode: 'number' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'number' }),
  deletedAt: integer('deleted_at', { mode: 'number' }),
})

export const itemsRelations = relations(itemsTable, ({ one }) => ({
  subcategory: one(subcategoriesTable, {
    fields: [itemsTable.subcategoryId],
    references: [subcategoriesTable.id],
    relationName: 'subcategory.item'
  }),
  owner: one(ownersTable, {
    fields: [itemsTable.ownerId],
    references: [ownersTable.id],
    relationName: 'owner.item',
  })
}))