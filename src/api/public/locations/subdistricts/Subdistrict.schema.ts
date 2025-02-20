import { messages } from '@/lib/constants/messages';
import { PaginationSchema } from '@/lib/schemas/Pagination.schema';
import { ApiResponseListSchema } from '@/lib/schemas/ApiResponse.schema';
import { SearchSchema } from '@/lib/schemas/Search.schema';
import { z } from '@hono/zod-openapi';
import { subdistricts } from 'db/schema/subdistricts';
import { createSelectSchema } from 'drizzle-zod';
import { DistrictExtendedSchema } from '../districts/District.schema';

export const SubdistrictSchema = createSelectSchema(subdistricts)
  .omit({ districtCode: true })
  .openapi('SubdistrictBase');
export const SubdistrictExtendedSchema = SubdistrictSchema
  .extend({
    district: DistrictExtendedSchema,
  })
  .openapi('SubdistrictExtended');
export const SubdistrictFilterSchema = z
  .object({
    districtCode: z.string().openapi({ example: '33.74.12' })
  })
  .merge(SearchSchema)
  .merge(PaginationSchema)
  .openapi('SubdistrictFilter')
const SubdistrictListSchema = z.array(SubdistrictSchema)
export const SubdistrictResponseListSchema = ApiResponseListSchema(SubdistrictListSchema, messages.successList('kelurahan'))

export type Subdistrict = z.infer<typeof SubdistrictSchema>
export type SubdistrictFilter = z.infer<typeof SubdistrictFilterSchema>