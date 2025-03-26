import { messages } from '@/lib/constants/messages';
import { PaginationSchema } from '@/lib/schemas/Pagination.schema';
import { ApiResponseListSchema } from '@/lib/schemas/ApiResponse.schema';
import { SearchSchema } from '@/lib/schemas/Search.schema';
import { z } from '@hono/zod-openapi';
import { districts } from 'db/schema/districts';
import { createSelectSchema } from 'drizzle-zod';
import { CityExtendedSchema } from '../cities/City.schema';
import { validationMessages } from '@/lib/constants/validation-message';

export const DistrictSchema = createSelectSchema(districts)
  .omit({ cityCode: true })
  .openapi('District');
export const DistrictExtendedSchema = DistrictSchema
  .extend({
    city: CityExtendedSchema,
  })
  .openapi('DistrictExtended');
export const DistrictFilterSchema = z
  .object({
    cityCode: z.string({ message: validationMessages.required('City code') }).openapi({ example: '33.74' })
  })
  .merge(SearchSchema)
  .merge(PaginationSchema)
  .openapi('DistrictFilter')
const DistrictListSchema = z.array(DistrictSchema);
export const DistrictResponseListSchema = ApiResponseListSchema(DistrictListSchema, messages.successList('districts'))

export type District = z.infer<typeof DistrictSchema>
export type DistrictFilter = z.infer<typeof DistrictFilterSchema>