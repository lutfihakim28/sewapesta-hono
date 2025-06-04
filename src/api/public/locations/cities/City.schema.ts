import { PaginationSchema } from '@/utils/schemas/Pagination.schema';
import { ApiResponseListSchema } from '@/utils/schemas/ApiResponse.schema';
import { SearchSchema } from '@/utils/schemas/Search.schema';
import { cities } from 'db/schema/cities';
import { createSelectSchema } from 'drizzle-zod';
import { StringSchema } from '@/utils/schemas/String.schema';
import { SchemaType } from '@/utils/types/Schema.type';
import { z } from 'zod';
import { ArraySchema } from '@/utils/schemas/Array.schema';
import { tMessage, tData } from '@/utils/constants/locales/locale';

const CitySchema = createSelectSchema(cities)
  .omit({ provinceCode: true })
  .openapi('City');
export const CityFilterSchema = z
  .object({
    provinceCode: new StringSchema('Province code').provinceCode().getSchema().openapi({ example: '33' })
  })
  .merge(SearchSchema)
  .merge(PaginationSchema)
  .openapi('CityFilter')
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
export type CityFilter = SchemaType<typeof CityFilterSchema>