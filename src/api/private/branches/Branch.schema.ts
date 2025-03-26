import { LocationSchema } from '@/api/public/locations/Location.schema';
import { messages } from '@/lib/constants/messages';
import { validationMessages } from '@/lib/constants/validation-message';
import { ApiResponseDataSchema, ApiResponseListSchema } from '@/lib/schemas/ApiResponse.schema';
import { PaginationSchema } from '@/lib/schemas/Pagination.schema';
import { SearchSchema } from '@/lib/schemas/Search.schema';
import { SortSchema } from '@/lib/schemas/Sort.schema';
import { z } from '@hono/zod-openapi';
import { branches } from 'db/schema/branches';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export type BranchColumn = keyof typeof branches.$inferSelect;

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
    provinceCode: z.string().optional().openapi({ description: 'example: 33' }),
    cityCode: z.string().optional().openapi({ description: 'example: 33.74' }),
    districtCode: z.string().optional().openapi({ description: 'example: 33.74.12' }),
    subdistrictCode: z.string().optional().openapi({ description: 'example: 33.74.12.1001' })
  })
  .merge(SearchSchema)
  .merge(PaginationSchema)
  .merge(SortSchema<BranchColumn>([
    'id',
    'cpName',
    'name',
  ]))
  .openapi('BranchFilter')

const BranchListSchema = z.array(BranchExtendedSchema)

export const BranchResponseListSchema = ApiResponseListSchema(BranchListSchema, messages.successList('branches'))

export const BranchRequestSchema = createInsertSchema(branches, {
  address: z.string({
    required_error: validationMessages.required('Address'),
    invalid_type_error: validationMessages.string('Address')
  }),
  cpName: z.string({
    required_error: validationMessages.required('Contact person name'),
    invalid_type_error: validationMessages.string('Contact person name')
  }),
  cpPhone: z.string({
    required_error: validationMessages.required('Contact phone'),
    invalid_type_error: validationMessages.string('Contact phone')
  }),
  name: z.string({
    required_error: validationMessages.required('Name'),
    invalid_type_error: validationMessages.string('Name')
  }),
  subdistrictCode: z.string({ message: validationMessages.required('Subdistrict') }),
}).pick({
  address: true,
  cpName: true,
  cpPhone: true,
  name: true,
  subdistrictCode: true,
}).openapi('BranchRequest')

export const BranchResponseExtendedDataSchema = ApiResponseDataSchema(BranchExtendedSchema, messages.successDetail('branch'))
export const BranchResponseDataSchema = ApiResponseDataSchema(BranchExtendedSchema, messages.successDetail('branch'))

export type Branch = z.infer<typeof BranchSchema>
export type BranchExtended = z.infer<typeof BranchExtendedSchema>
export type BranchFilter = z.infer<typeof BranchFilterSchema>
export type BranchRequest = z.infer<typeof BranchRequestSchema>