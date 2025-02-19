import { MESSAGES } from '@/lib/constants/MESSAGES';
import { PaginationSchema } from '@/lib/schemas/Pagination.schema';
import { ApiResponseListSchema } from '@/lib/schemas/ApiResponse.schema';
import { SearchSchema } from '@/lib/schemas/Search.schema';
import { z } from '@hono/zod-openapi';
import { provinces } from 'db/schema/provinces';
import { createSelectSchema } from 'drizzle-zod';

export const ProvinceSchema = createSelectSchema(provinces).openapi('Province');
export const ProvinceFilterSchema = SearchSchema
  .merge(PaginationSchema)
  .openapi('ProvinceFilter')
export const ProvinceListSchema = z.array(ProvinceSchema)
export const ProvinceResponseListSchema = ApiResponseListSchema(ProvinceListSchema, MESSAGES.successList('provinsi'))

export type ProvinceFilter = z.infer<typeof ProvinceFilterSchema>