import { ImageReferenceEnum } from '@/enums/ImageReference.Enum';
import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const images = sqliteTable('images', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  path: text('path').notNull().unique(),
  url: text('url').notNull().unique(),
  reference: text('reference', { enum: [ ImageReferenceEnum.EMPLOYEE, ImageReferenceEnum.ITEM] }).notNull(),
  referenceId: integer('reference_id').notNull(),
  createdAt: integer('created_at').notNull(),
}, (table) => ({
  imageReferenceIndex: index('image_reference_index').on(table.reference),
  imageReferenceIdIndex: index('image_reference_id_index').on(table.referenceId),
}))