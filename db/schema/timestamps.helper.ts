import dayjs from "dayjs";
import { int } from 'drizzle-orm/mysql-core';

export const timestamps = {
  createdAt: int('created_at').notNull().$defaultFn(() => dayjs().unix()),
  updatedAt: int('updated_at').$onUpdateFn(() => dayjs().unix()),
  deletedAt: int('deleted_at'),
}