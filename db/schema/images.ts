import { ImageReferenceEnum } from '@/lib/enums/ImageReference.Enum';
import { index, int, mysqlTable, varchar } from 'drizzle-orm/mysql-core';

export const images = mysqlTable('images', {
  id: int('id').primaryKey().autoincrement(),
  path: varchar('path', { length: 255 }).notNull().unique(),
  url: varchar('url', { length: 255 }).notNull().unique(),
  reference: varchar('reference', { length: 7, enum: [ImageReferenceEnum.PROFILE, ImageReferenceEnum.ITEM] }).notNull(),
  referenceId: int('reference_id').notNull(),
  createdAt: int('created_at').notNull(),
}, (table) => [
  index('image_reference_index').on(table.reference),
  index('image_reference_id_index').on(table.referenceId),
])