import { districts } from 'db/schema/districts';
import { provinces } from 'db/schema/provinces';
import { relations } from 'drizzle-orm';
import { index, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const cities = sqliteTable('cities', {
  code: text('code').primaryKey(),
  name: text('name').notNull(),
  provinceCode: text('province_code').references(() => provinces.code).notNull()
}, (table) => ({
  cityProvinceCodeIndex: index('city_province_code_index').on(table.provinceCode),
}))

export const citiesRelations = relations(cities, ({ one, many }) => ({
  province: one(provinces, {
    fields: [cities.provinceCode],
    references: [provinces.code],
  }),
  districts: many(districts),
}))