import { ImageReferenceEnum } from '@/utils/enums/ImageReference.Enum';
import { AppDate } from '@/utils/libs/AppDate';
import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const images = sqliteTable('images', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  path: text('path').notNull().unique(),
  url: text('url').notNull().unique(),
  reference: text('reference', { enum: [ImageReferenceEnum.Profile, ImageReferenceEnum.Equipment, ImageReferenceEnum.Inventory] }).notNull(),
  referenceId: integer('reference_id').notNull(),
  createdAt: integer('created_at').notNull().$defaultFn(() => new AppDate().unix()),
}, (table) => [
  index('image_reference_index').on(table.reference),
  index('image_reference_id_index').on(table.referenceId)
])
