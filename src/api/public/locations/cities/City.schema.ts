import { ApiResponseListSchema } from '@/utils/schemas/ApiResponse.schema';
import { cities } from 'db/schema/cities';
import { createSelectSchema } from 'drizzle-zod';
import { SchemaType } from '@/utils/types/Schema.type';
import { ArraySchema } from '@/utils/schemas/Array.schema';
import { tMessage, tData } from '@/utils/constants/locales/locale';

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

export type City = SchemaType<typeof CitySchema>