import { MESSAGES } from '@/lib/constants/MESSAGES';
import { PaginationSchema } from '@/lib/schemas/Pagination.schema';
import { ApiResponseListSchema } from '@/lib/schemas/ApiResponse.schema';
import { SearchSchema } from '@/lib/schemas/Search.schema';
import { z } from '@hono/zod-openapi';
import { districts } from 'db/schema/districts';
import { createSelectSchema } from 'drizzle-zod';
import { CitySchema } from '../cities/City.schema';

export const DistrictSchema = createSelectSchema(districts)
  .extend({
    city: CitySchema,
  })
  .openapi('District');
export const DistrictFilterSchema = z
  .object({
    cityCode: z.string().openapi({ example: '33.74' })
  })
  .merge(SearchSchema)
  .merge(PaginationSchema)
  .openapi('DistrictFilter')
export const DistrictListSchema = z.array(DistrictSchema.omit({ city: true, cityCode: true }));
export const DistrictResponseListSchema = ApiResponseListSchema(DistrictListSchema, MESSAGES.successList('kecamatan'))

export type DistrictFilter = z.infer<typeof DistrictFilterSchema>