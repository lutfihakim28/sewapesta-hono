import { cities } from 'db/schema/cities';
import { subdistricts } from 'db/schema/subdistricts';
import { relations } from 'drizzle-orm';
import { index, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const districts = sqliteTable('districts', {
  code: text('code').primaryKey(),
  name: text('name').notNull(),
  cityCode: text('city_code').references(() => cities.code).notNull()
}, (table) => ({
  districtCityCodeIndex: index('district_city_code_index').on(table.cityCode),
}))

export const districtsRelations = relations(districts, ({ one, many }) => ({
  city: one(cities, {
    fields: [districts.cityCode],
    references: [cities.code],
  }),
  subdistricts: many(subdistricts),
}))