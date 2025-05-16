import { integer } from "drizzle-orm/sqlite-core";
import { AppDate } from '@/utils/libs/AppDate';

export const timestamps = {
  createdAt: integer('created_at').notNull().$defaultFn(() => new AppDate().unix),
  updatedAt: integer('updated_at').$onUpdateFn(() => new AppDate().unix),
  deletedAt: integer('deleted_at'),
}