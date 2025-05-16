import { messages } from '@/utils/constants/messages';
import { PaginationSchema } from '@/utils/schemas/Pagination.schema';
import { ApiResponseListSchema } from '@/utils/schemas/ApiResponse.schema';
import { SearchSchema } from '@/utils/schemas/Search.schema';
import { z } from '@hono/zod-openapi';
import { cities } from 'db/schema/cities';
import { createSelectSchema } from 'drizzle-zod';
// import { ProvinceSchema } from '../provinces/Province.schema';
import { validationMessages } from '@/utils/constants/validation-message';

const CitySchema = createSelectSchema(cities)
  .omit({ provinceCode: true })
  .openapi('City');
// export const CityExtendedSchema = CitySchema
//   .extend({ province: ProvinceSchema })
//   .openapi('CityExtended')
export const CityFilterSchema = z
  .object({
    provinceCode: z.string({ message: validationMessages.required('Province code') }).openapi({ example: '33' })
  })
  .merge(SearchSchema)
  .merge(PaginationSchema)
  .openapi('CityFilter')
const CityListSchema = z.array(CitySchema)
export const CityResponseListSchema = ApiResponseListSchema(CityListSchema, messages.successList('cities'))

export type City = z.infer<typeof CitySchema>
export type CityFilter = z.infer<typeof CityFilterSchema>