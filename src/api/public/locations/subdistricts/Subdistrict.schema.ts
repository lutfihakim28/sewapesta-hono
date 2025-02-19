import { MESSAGES } from '@/lib/constants/MESSAGES';
import { PaginationSchema } from '@/lib/schemas/Pagination.schema';
import { ApiResponseListSchema } from '@/lib/schemas/ApiResponse.schema';
import { SearchSchema } from '@/lib/schemas/Search.schema';
import { z } from '@hono/zod-openapi';
import { subdistricts } from 'db/schema/subdistricts';
import { createSelectSchema } from 'drizzle-zod';
import { DistrictSchema } from '../districts/District.schema';

export const SubdistrictSchema = createSelectSchema(subdistricts)
  .extend({
    district: DistrictSchema,
  })
  .openapi('Subdistrict');
export const SubdistrictFilterSchema = z
  .object({
    districtCode: z.string().openapi({ example: '33.74.12' })
  })
  .merge(SearchSchema)
  .merge(PaginationSchema)
  .openapi('SubdistrictFilter')
export const SubdistrictListSchema = z.array(SubdistrictSchema.omit({ district: true, districtCode: true }))
export const SubdistrictResponseListSchema = ApiResponseListSchema(SubdistrictListSchema, MESSAGES.successList('kelurahan'))

export type SubdistrictFilter = z.infer<typeof SubdistrictFilterSchema>