import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';
import { OwnerTypeEnum } from '@/enums/OwnerTypeEnum';
import { items } from './items';

export const owners = sqliteTable('owners', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  phone: text('phone').notNull(),
  type: text('type', {
    enum: [
      OwnerTypeEnum.Corporation,
      OwnerTypeEnum.Individu,
    ]
  }).default(OwnerTypeEnum.Individu),
  createdAt: integer('created_at', { mode: 'number' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'number' }),
  deletedAt: integer('deleted_at', { mode: 'number' }),
})

export const ownersRelations = relations(owners, ({ many }) => ({
  items: many(items, {
    relationName: 'owner.items'
  }),
}))