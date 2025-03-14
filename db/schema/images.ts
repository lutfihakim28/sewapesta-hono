import { ImageReferenceEnum } from '@/lib/enums/ImageReference.Enum';
import dayjs from 'dayjs';
import { bigint, index, int, mysqlTable, varchar } from 'drizzle-orm/mysql-core';

export const images = mysqlTable('images', {
  id: int('id').primaryKey().autoincrement(),
  path: varchar('path', { length: 255 }).notNull().unique(),
  url: varchar('url', { length: 255 }).notNull().unique(),
  reference: varchar('reference', { length: 7, enum: [ImageReferenceEnum.PROFILE, ImageReferenceEnum.ITEM] }).notNull(),
  referenceId: int('reference_id').notNull(),
  createdAt: bigint('created_at', { mode: 'number' }).notNull().$defaultFn(() => dayjs().unix()),
}, () => [
  imageReferenceIndex,
  imageReferenceIdIndex,
])

export const imageReferenceIndex = index('image_reference_index').on(images.reference)
export const imageReferenceIdIndex = index('image_reference_id_index').on(images.referenceId)