import dayjs from 'dayjs';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import {timestamps} from "db/schema/timestamps.helper";

export const categories = sqliteTable('categories', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  ...timestamps,
})