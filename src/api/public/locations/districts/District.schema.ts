import { MESSAGES } from '@/lib/constants/MESSAGES';
import { MetaSchema } from '@/lib/schemas/MetaSchema';
import { PaginationSchema } from '@/lib/schemas/PaginationSchema';
import { ResponseSchema } from '@/lib/schemas/ResponseSchema';
import { SearchSchema } from '@/lib/schemas/SearchSchema';
import { z } from '@hono/zod-openapi';
import { districts } from 'db/schema/districts';
import { createSelectSchema } from 'drizzle-zod';
import { CitySchema } from '../cities/City.schema';

export const DistrictSchema = createSelectSchema(districts).extend({
  city: CitySchema,
}).openapi('District');
export const DistrictFilterSchema = z
  .object({
    cityCode: z.string().openapi({ example: '33.74' })
  })
  .merge(SearchSchema)
  .merge(PaginationSchema)
  .openapi('DistrictFilter')
export const DistrictListSchema = ResponseSchema(z.array(DistrictSchema.omit({ city: true })), MESSAGES.successList('kecamatan'))
  .extend({
    meta: MetaSchema
  })

export type District = z.infer<typeof DistrictSchema>
export type DistrictFilter = z.infer<typeof DistrictFilterSchema>
export type DistrictList = z.infer<typeof DistrictListSchema>