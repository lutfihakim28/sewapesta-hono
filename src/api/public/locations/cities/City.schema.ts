import { MESSAGES } from '@/lib/constants/MESSAGES';
import { MetaSchema } from '@/lib/schemas/MetaSchema';
import { PaginationSchema } from '@/lib/schemas/PaginationSchema';
import { ResponseSchema } from '@/lib/schemas/ResponseSchema';
import { SearchSchema } from '@/lib/schemas/SearchSchema';
import { z } from '@hono/zod-openapi';
import { cities } from 'db/schema/cities';
import { createSelectSchema } from 'drizzle-zod';
import { ProvinceSchema } from '../provinces/Province.schema';

export const CitySchema = createSelectSchema(cities).extend({
  province: ProvinceSchema,
}).openapi('City');
export const CityFilterSchema = z
  .object({
    provinceCode: z.string().openapi({ example: '33' })
  })
  .merge(SearchSchema)
  .merge(PaginationSchema)
  .openapi('CityFilter')
export const CityListSchema = ResponseSchema(z.array(CitySchema.omit({ province: true })), MESSAGES.successList('kabupaten/kota'))
  .extend({
    meta: MetaSchema
  })

export type City = z.infer<typeof CitySchema>
export type CityFilter = z.infer<typeof CityFilterSchema>
export type CityList = z.infer<typeof CityListSchema>