import { messages } from '@/lib/constants/messages';
import { PaginationSchema } from '@/lib/schemas/Pagination.schema';
import { ApiResponseListSchema } from '@/lib/schemas/ApiResponse.schema';
import { SearchSchema } from '@/lib/schemas/Search.schema';
import { z } from '@hono/zod-openapi';
import { subdistricts } from 'db/schema/subdistricts';
import { createSelectSchema } from 'drizzle-zod';
import { DistrictExtendedSchema } from '../districts/District.schema';
import { validationMessages } from '@/lib/constants/validation-message';

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
    districtCode: z.string({ message: validationMessages.required('District code') }).openapi({ example: '33.74.12' })
  })
  .merge(SearchSchema)
  .merge(PaginationSchema)
  .openapi('SubdistrictFilter')
const SubdistrictListSchema = z.array(SubdistrictSchema)
export const SubdistrictResponseListSchema = ApiResponseListSchema(SubdistrictListSchema, messages.successList('subdistricts'))

export type Subdistrict = z.infer<typeof SubdistrictSchema>
export type SubdistrictFilter = z.infer<typeof SubdistrictFilterSchema>