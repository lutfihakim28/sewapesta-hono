import { MESSAGES } from '@/lib/constants/MESSAGES';
import { PaginationSchema } from '@/lib/schemas/Pagination.schema';
import { ApiResponseListSchema } from '@/lib/schemas/ApiResponse.schema';
import { SearchSchema } from '@/lib/schemas/Search.schema';
import { z } from '@hono/zod-openapi';
import { cities } from 'db/schema/cities';
import { createSelectSchema } from 'drizzle-zod';
import { ProvinceSchema } from '../provinces/Province.schema';

export const CitySchema = createSelectSchema(cities)
  .extend({
    province: ProvinceSchema,
  })
  .openapi('City');
export const CityFilterSchema = z
  .object({
    provinceCode: z.string().openapi({ example: '33' })
  })
  .merge(SearchSchema)
  .merge(PaginationSchema)
  .openapi('CityFilter')
export const CityListSchema = z.array(CitySchema.omit({ province: true, provinceCode: true }))
export const CityResponseListSchema = ApiResponseListSchema(CityListSchema, MESSAGES.successList('kabupaten/kota'))

export type CityFilter = z.infer<typeof CityFilterSchema>