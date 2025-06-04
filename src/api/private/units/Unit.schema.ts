import { ApiResponseListSchema } from '@/utils/schemas/ApiResponse.schema';
import { PaginationSchema } from '@/utils/schemas/Pagination.schema';
import { SearchSchema } from '@/utils/schemas/Search.schema';
import { units } from 'db/schema/units';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { StringSchema } from '@/utils/schemas/String.schema';
import { SchemaType } from '@/utils/types/Schema.type';
import { tData, tMessage } from '@/utils/constants/locales/locale';

export const UnitSchema = createSelectSchema(units)
  .pick({
    id: true,
    name: true,
  })
  .openapi('Unit')

export const UnitRequestSchema = createInsertSchema(units, {
  name: new StringSchema('Name').getSchema(),
})
  .pick({
    name: true,
  })
  .openapi('UnitRequest')

export const UnitFilterSchema = SearchSchema
  .merge(PaginationSchema)
  .openapi('UnitFilter')

export const UnitResponseSchema = ApiResponseListSchema(UnitSchema, tMessage({
  lang: 'en',
  key: 'successList',
  textCase: 'sentence',
  params: {
    data: tData({
      lang: 'en',
      key: 'unit',
      mode: 'plural'
    })
  }
}))

export type Unit = SchemaType<typeof UnitSchema>
export type UnitFilter = SchemaType<typeof UnitFilterSchema>
export type UnitRequest = SchemaType<typeof UnitRequestSchema>