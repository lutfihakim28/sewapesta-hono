import { MESSAGES } from '@/lib/constants/MESSAGES';
import { MetaSchema } from '@/lib/schemas/MetaSchema';
import { PaginationSchema } from '@/lib/schemas/PaginationSchema';
import { ResponseSchema } from '@/lib/schemas/ResponseSchema';
import { SearchSchema } from '@/lib/schemas/SearchSchema';
import { z } from '@hono/zod-openapi';
import { provinces } from 'db/schema/provinces';
import { createSelectSchema } from 'drizzle-zod';

export const ProvinceSchema = createSelectSchema(provinces).openapi('Province');
export const ProvinceFilterSchema = SearchSchema
  .merge(PaginationSchema)
  .openapi('ProvinceFilter')
export const ProvinceListSchema = ResponseSchema(z.array(ProvinceSchema), MESSAGES.successList('provinsi'))
  .extend({
    meta: MetaSchema
  })

export type Province = z.infer<typeof ProvinceSchema>
export type ProvinceFilter = z.infer<typeof ProvinceFilterSchema>
export type ProvinceList = z.infer<typeof ProvinceListSchema>