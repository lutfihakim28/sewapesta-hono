import { SubdistrictSchema } from '@/api/public/locations/subdistricts/Subdistrict.schema';
import { MESSAGES } from '@/lib/constants/MESSAGES';
import { PaginationSchema } from '@/lib/schemas/Pagination.schema';
import { SearchSchema } from '@/lib/schemas/Search.schema';
import { ResponseSchema } from '@/schemas/ResponseSchema';
import { z } from '@hono/zod-openapi';
import { branches } from 'db/schema/branches';
import { createSelectSchema } from 'drizzle-zod';

export const BranchSchema = createSelectSchema(branches)
  .pick({
    id: true,
    name: true,
    cpPhone: true,
    cpName: true,
    address: true,
    subdistrictCode: true,
  })
  .extend({
    subdistrict: SubdistrictSchema,
  })
  .openapi('Branch')
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
export const BranchListSchema = z.array(BranchSchema.omit({ subdistrictCode: true }))
export const BranchResponseListSchema = ResponseSchema(BranchListSchema, MESSAGES.successList('cabang'))

export type BranchFilter = z.infer<typeof BranchFilterSchema>