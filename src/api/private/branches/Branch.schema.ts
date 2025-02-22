import { SubdistrictExtendedSchema } from '@/api/public/locations/subdistricts/Subdistrict.schema';
import { messages } from '@/lib/constants/messages';
import { ApiResponseListSchema } from '@/lib/schemas/ApiResponse.schema';
import { PaginationSchema } from '@/lib/schemas/Pagination.schema';
import { SearchSchema } from '@/lib/schemas/Search.schema';
import { z } from '@hono/zod-openapi';
import { branches } from 'db/schema/branches';
import { createSelectSchema } from 'drizzle-zod';

export const BranchSchema = createSelectSchema(branches)
  .pick({
    address: true,
    cpName: true,
    cpPhone: true,
    id: true,
    name: true,
  })
  .openapi('Branch')
export const BranchExtendedSchema = BranchSchema
  .extend({
    subdistrict: SubdistrictExtendedSchema,
  })
  .openapi('BranchExtended')
export const BranchFilterSchema = z
  .object({
    provinceCode: z.string().optional().openapi({ example: '33' }),
    cityCode: z.string().optional().openapi({ example: '33.74' }),
    districtCode: z.string().optional().openapi({ example: '33.74.12' }),
    subdistrictCode: z.string().optional().openapi({ example: '33.74.12.1001' })
  })
  .merge(SearchSchema)
  .merge(PaginationSchema)
  .openapi('BranchFilter')
export const BranchListSchema = z.array(BranchExtendedSchema)
export const BranchResponseListSchema = ApiResponseListSchema(BranchListSchema, messages.successList('branches'))

export type Branch = z.infer<typeof BranchSchema>
export type BranchExtended = z.infer<typeof BranchExtendedSchema>
export type BranchFilter = z.infer<typeof BranchFilterSchema>