import { MESSAGES } from '@/lib/constants/MESSAGES';
import { MetaSchema } from '@/lib/schemas/MetaSchema';
import { PaginationSchema } from '@/lib/schemas/PaginationSchema';
import { ResponseSchema } from '@/lib/schemas/ResponseSchema';
import { SearchSchema } from '@/lib/schemas/SearchSchema';
import { z } from '@hono/zod-openapi';
import { subdistricts } from 'db/schema/subdistricts';
import { createSelectSchema } from 'drizzle-zod';
import { DistrictSchema } from '../districts/District.schema';

export const SubdistrictSchema = createSelectSchema(subdistricts).extend({
  district: DistrictSchema,
}).openapi('Subdistrict');
export const SubdistrictFilterSchema = z
  .object({
    districtCode: z.string().openapi({ example: '33.74.12' })
  })
  .merge(SearchSchema)
  .merge(PaginationSchema)
  .openapi('SubdistrictFilter')
export const SubdistrictListSchema = ResponseSchema(z.array(SubdistrictSchema.omit({ district: true })), MESSAGES.successList('kelurahan'))
  .extend({
    meta: MetaSchema
  })

export type Subdistrict = z.infer<typeof SubdistrictSchema>
export type SubdistrictFilter = z.infer<typeof SubdistrictFilterSchema>
export type SubdistrictList = z.infer<typeof SubdistrictListSchema>