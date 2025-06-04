import { PaginationSchema } from '@/utils/schemas/Pagination.schema';
import { ApiResponseListSchema } from '@/utils/schemas/ApiResponse.schema';
import { SearchSchema } from '@/utils/schemas/Search.schema';
import { provinces } from 'db/schema/provinces';
import { createSelectSchema } from 'drizzle-zod';
import { ArraySchema } from '@/utils/schemas/Array.schema';
import { SchemaType } from '@/utils/types/Schema.type';
import { tMessage, tData } from '@/utils/constants/locales/locale';

export const ProvinceSchema = createSelectSchema(provinces).openapi('Province');
export const ProvinceFilterSchema = SearchSchema
  .merge(PaginationSchema)
  .openapi('ProvinceFilter')
const ProvinceListSchema = new ArraySchema('Province list', ProvinceSchema).getSchema()
export const ProvinceResponseListSchema = ApiResponseListSchema(ProvinceListSchema, tMessage({
  lang: 'en',
  key: 'successList',
  textCase: 'sentence',
  params: {
    data: tData({
      lang: 'en',
      key: 'province',
      mode: 'plural'
    })
  }
}))

export type Province = SchemaType<typeof ProvinceSchema>
export type ProvinceFilter = SchemaType<typeof ProvinceFilterSchema>