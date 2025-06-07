import { ApiResponseListSchema } from '@/utils/schemas/ApiResponse.schema';
import { cities } from 'db/schema/cities';
import { createSelectSchema } from 'drizzle-zod';
import { SchemaType } from '@/utils/types/Schema.type';
import { ArraySchema } from '@/utils/schemas/Array.schema';
import { tMessage, tData } from '@/utils/constants/locales/locale';
import { ObjectSchema } from '@/utils/schemas/Object.schema';
import { StringSchema } from '@/utils/schemas/String.schema';

const CitySchema = createSelectSchema(cities)
  .openapi('City');

const CityListSchema = new ArraySchema('City list', CitySchema).getSchema()
export const CityResponseListSchema = ApiResponseListSchema(CityListSchema, tMessage({
  lang: 'en',
  key: 'successList',
  textCase: 'sentence',
  params: {
    data: tData({
      lang: 'en',
      key: 'city',
      mode: 'plural'
    })
  }
}))

export const CityFilterSchema = new ObjectSchema({
  provinceCode: new StringSchema('Province code').provinceCode().getSchema()
}).getSchema().openapi('CityFilter')

export type City = SchemaType<typeof CitySchema>
export type CityFilter = SchemaType<typeof CityFilterSchema>