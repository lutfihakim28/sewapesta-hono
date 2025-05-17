import { messages } from '@/utils/constants/messages';
import { PaginationSchema } from '@/utils/schemas/Pagination.schema';
import { ApiResponseListSchema } from '@/utils/schemas/ApiResponse.schema';
import { SearchSchema } from '@/utils/schemas/Search.schema';
import { cities } from 'db/schema/cities';
import { createSelectSchema } from 'drizzle-zod';
// import { ProvinceSchema } from '../provinces/Province.schema';
import { StringSchema } from '@/utils/schemas/String.schema';
import { SchemaType } from '@/utils/types/Schema.type';
import { z } from 'zod';

const CitySchema = createSelectSchema(cities)
  .omit({ provinceCode: true })
  .openapi('City');
// export const CityExtendedSchema = CitySchema
//   .extend({ province: ProvinceSchema })
//   .openapi('CityExtended')
export const CityFilterSchema = z
  .object({
    provinceCode: new StringSchema('Province code').provinceCode().getSchema().openapi({ example: '33' })
  })
  .merge(SearchSchema)
  .merge(PaginationSchema)
  .openapi('CityFilter')
const CityListSchema = z.array(CitySchema)
export const CityResponseListSchema = ApiResponseListSchema(CityListSchema, messages.successList('cities'))

export type City = SchemaType<typeof CitySchema>
export type CityFilter = SchemaType<typeof CityFilterSchema>