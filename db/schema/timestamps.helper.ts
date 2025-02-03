import {integer} from "drizzle-orm/sqlite-core";
import dayjs from "dayjs";

export const timestamps = {
  createdAt: integer('created_at').notNull().$defaultFn(() => dayjs().unix()),
  updatedAt: integer('updated_at').$onUpdateFn(() => dayjs().unix()),
  deletedAt: integer('deleted_at'),
}