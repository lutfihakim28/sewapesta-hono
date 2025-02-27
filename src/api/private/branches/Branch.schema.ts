import { LocationSchema } from '@/api/public/locations/Location.schema';
import { messages } from '@/lib/constants/messages';
import { validationMessages } from '@/lib/constants/validationMessage';
import { ApiResponseDataSchema, ApiResponseListSchema } from '@/lib/schemas/ApiResponse.schema';
import { PaginationSchema } from '@/lib/schemas/Pagination.schema';
import { SearchSchema } from '@/lib/schemas/Search.schema';
import { z } from '@hono/zod-openapi';
import { branches } from 'db/schema/branches';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const BranchSchema = createSelectSchema(branches)
  .pick({
    address: true,
    cpName: true,
    cpPhone: true,
    id: true,
    name: true,
    subdistrictCode: true,
  })
  .openapi('Branch')

export const BranchExtendedSchema = BranchSchema
  .omit({
    subdistrictCode: true,
  })
  .extend({
    location: LocationSchema,
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

const BranchListSchema = z.array(BranchExtendedSchema)

export const BranchResponseListSchema = ApiResponseListSchema(BranchListSchema, messages.successList('branches'))

export const BranchRequestSchema = createInsertSchema(branches, {
  address: z.string({ message: validationMessages.required('Address') }),
  cpName: z.string({ message: validationMessages.required('Contact person name') }),
  cpPhone: z.string({ message: validationMessages.required('Contact phone') }),
  name: z.string({ message: validationMessages.required('Name') }),
  subdistrictCode: z.string({ message: validationMessages.required('Subdistrict') }),
}).pick({
  address: true,
  cpName: true,
  cpPhone: true,
  name: true,
  subdistrictCode: true,
}).openapi('BranchRequest')

export const BranchResponseExtendedDataSchema = ApiResponseDataSchema(BranchExtendedSchema, messages.successDetail('branch'))
export const BranchResponseDataSchema = ApiResponseDataSchema(BranchSchema, messages.successDetail('branch'))

export type Branch = z.infer<typeof BranchSchema>
export type BranchExtended = z.infer<typeof BranchExtendedSchema>
export type BranchFilter = z.infer<typeof BranchFilterSchema>
export type BranchRequest = z.infer<typeof BranchRequestSchema>