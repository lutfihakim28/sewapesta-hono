import { messages } from '@/lib/constants/messages';
import { validationMessages } from '@/lib/constants/validation-message';
import { ApiResponseListSchema } from '@/lib/schemas/ApiResponse.schema';
import { PaginationSchema } from '@/lib/schemas/Pagination.schema';
import { SearchSchema } from '@/lib/schemas/Search.schema';
import { units } from 'db/schema/units';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from '@hono/zod-openapi';

export const UnitSchema = createSelectSchema(units)
  .pick({
    id: true,
    name: true,
  })
  .openapi('Unit')

export const UnitRequestSchema = createInsertSchema(units, {
  name: z.string({
    required_error: validationMessages.required('Name'),
    invalid_type_error: validationMessages.string('Name')
  }),
})
  .pick({
    name: true,
  })
  .openapi('UnitRequest')

export const UnitFilterSchema = SearchSchema
  .merge(PaginationSchema)
  .openapi('UnitFilter')

export const UnitResponseSchema = ApiResponseListSchema(UnitSchema, messages.successList('units'))

export type Unit = z.infer<typeof UnitSchema>
export type UnitFilter = z.infer<typeof UnitFilterSchema>
export type UnitRequest = z.infer<typeof UnitRequestSchema>