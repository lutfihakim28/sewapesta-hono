import { subdistricts } from 'db/schema/subdistricts';
import { users } from 'db/schema/users';
import { relations } from 'drizzle-orm';
import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { timestamps } from "db/schema/timestamps.helper";

export const branches = sqliteTable('branches', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  cpName: text('cp_name').notNull(),
  cpPhone: text('cp_phone').notNull(),
  address: text('address').notNull(),
  subdistrictCode: text('subdistrict_code').references(() => subdistricts.code).notNull(),
  ...timestamps,
}, (table) => ({
  branchSubdistrictCodeIndex: index('branch_subdistrict_code_index').on(table.subdistrictCode),
}))

export const branchesRelations = relations(branches, ({ many, one }) => ({
  users: many(users),
  subdistrict: one(subdistricts, {
    fields: [branches.subdistrictCode],
    references: [subdistricts.code],
  })
}))