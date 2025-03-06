import { cities } from 'db/schema/cities';
import { index, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const districts = sqliteTable('districts', {
  code: text('code').primaryKey(),
  name: text('name').notNull(),
  cityCode: text('city_code').references(() => cities.code).notNull()
}, (table) => ({
  districtCityCodeIndex: index('district_city_code_index').on(table.cityCode),
}))