import dayjs from "dayjs";
import { bigint } from 'drizzle-orm/mysql-core';

export const timestamps = {
  createdAt: bigint('created_at', { mode: 'number', unsigned: true }).notNull().$defaultFn(() => dayjs().unix()),
  updatedAt: bigint('updated_at', { mode: 'number', unsigned: true }).$onUpdateFn(() => dayjs().unix()),
  deletedAt: bigint('deleted_at', { mode: 'number', unsigned: true }),
}