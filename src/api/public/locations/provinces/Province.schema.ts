import { messages } from '@/utils/constants/messages';
import { PaginationSchema } from '@/utils/schemas/Pagination.schema';
import { ApiResponseListSchema } from '@/utils/schemas/ApiResponse.schema';
import { SearchSchema } from '@/utils/schemas/Search.schema';
import { z } from '@hono/zod-openapi';
import { provinces } from 'db/schema/provinces';
import { createSelectSchema } from 'drizzle-zod';

export const ProvinceSchema = createSelectSchema(provinces).openapi('Province');
export const ProvinceFilterSchema = SearchSchema
  .merge(PaginationSchema)
  .openapi('ProvinceFilter')
const ProvinceListSchema = z.array(ProvinceSchema)
export const ProvinceResponseListSchema = ApiResponseListSchema(ProvinceListSchema, messages.successList('provinces'))

export type Province = z.infer<typeof ProvinceSchema>
export type ProvinceFilter = z.infer<typeof ProvinceFilterSchema>