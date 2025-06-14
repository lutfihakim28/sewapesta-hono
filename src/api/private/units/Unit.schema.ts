import { ApiResponseDataSchema, ApiResponseListSchema } from '@/utils/schemas/ApiResponse.schema';
import { PaginationSchema } from '@/utils/schemas/Pagination.schema';
import { SearchSchema } from '@/utils/schemas/Search.schema';
import { units } from 'db/schema/units';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { StringSchema } from '@/utils/schemas/String.schema';
import { SchemaType } from '@/utils/types/Schema.type';
import { tData, tMessage } from '@/utils/constants/locales/locale';
import { ArraySchema } from '@/utils/schemas/Array.schema';
import { OptionSchema } from '@/utils/schemas/Option.schema';
import { ObjectSchema } from '@/utils/schemas/Object.schema';

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

export const UnitCreateManySchema = new ObjectSchema({
  names: new ArraySchema('Names', new StringSchema('Name').getSchema()).getSchema()
}).getSchema().openapi('UnitCreateMany')

export const UnitFilterSchema = SearchSchema
  .merge(PaginationSchema)
  .openapi('UnitFilter')

const UnitListSchema = new ArraySchema('Units', UnitSchema)
  .getSchema()
  .openapi('UnitList')

export const UnitResponseListSchema = ApiResponseListSchema(UnitListSchema, tMessage({
  lang: 'en',
  key: 'successList',
  textCase: 'sentence',
  params: {
    data: tData({ lang: 'en', key: 'unit', mode: 'plural' })
  }
}))

export const UnitResponseSchema = ApiResponseDataSchema(UnitSchema, tMessage({
  key: 'successCreate',
  lang: 'en',
  textCase: 'sentence',
  params: {
    data: tData({ key: 'unit', lang: 'en' })
  }
}))

export const UnitCreateManyResponseSchema = ApiResponseDataSchema(UnitListSchema, tMessage({
  key: 'successCreate',
  lang: 'en',
  textCase: 'sentence',
  params: {
    data: tData({ key: 'unit', lang: 'en' })
  }
}))

export const UnitOptionResponseSchema = ApiResponseDataSchema(new ArraySchema('Unit options', OptionSchema).getSchema(), tMessage({
  key: 'successList',
  lang: 'en',
  textCase: 'sentence',
  params: {
    data: tData({ key: 'unitOptions', lang: 'en' })
  }
}))

// ... existing type exports ...
export type Unit = SchemaType<typeof UnitSchema>
export type UnitFilter = SchemaType<typeof UnitFilterSchema>
export type UnitRequest = SchemaType<typeof UnitRequestSchema>
export type UnitCreateMany = SchemaType<typeof UnitCreateManySchema>