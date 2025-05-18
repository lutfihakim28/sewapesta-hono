import { ImageReferenceEnum } from '@/utils/enums/ImageReference.Enum';
import { index, integer, pgTable, serial, text, varchar } from 'drizzle-orm/pg-core';
import { timestamps } from './timestamps.helper';

export const images = pgTable('images', {
  id: serial('id').primaryKey(),
  path: text('path').notNull().unique(),
  url: text('url').notNull().unique(),
  reference: varchar('reference', { enum: [ImageReferenceEnum.Profile, ImageReferenceEnum.Equipment, ImageReferenceEnum.Inventory], length: 9 }).notNull(),
  referenceId: integer('reference_id').notNull(),
  ...timestamps,
}, (table) => [
  index('image_reference_index').on(table.reference),
  index('image_reference_id_index').on(table.referenceId)
])
