import { messages } from '@/lib/constants/messages';
import { PaginationSchema } from '@/lib/schemas/Pagination.schema';
import { ApiResponseListSchema } from '@/lib/schemas/ApiResponse.schema';
import { SearchSchema } from '@/lib/schemas/Search.schema';
import { z } from '@hono/zod-openapi';
import { cities } from 'db/schema/cities';
import { createSelectSchema } from 'drizzle-zod';
import { ProvinceSchema } from '../provinces/Province.schema';

export const CitySchema = createSelectSchema(cities)
  .omit({ provinceCode: true })
  .openapi('City');
export const CityExtendedSchema = CitySchema
  .extend({ province: ProvinceSchema })
  .openapi('CityExtended')
export const CityFilterSchema = z
  .object({
    provinceCode: z.string().openapi({ example: '33' })
  })
  .merge(SearchSchema)
  .merge(PaginationSchema)
  .openapi('CityFilter')
const CityListSchema = z.array(CitySchema)
export const CityResponseListSchema = ApiResponseListSchema(CityListSchema, messages.successList('kabupaten/kota'))

export type City = z.infer<typeof CitySchema>
export type CityFilter = z.infer<typeof CityFilterSchema>