import { messages } from '@/utils/constants/messages';
import { validationMessages } from '@/utils/constants/validation-message';
import { ApiResponseListSchema } from '@/utils/schemas/ApiResponse.schema';
import { PaginationSchema } from '@/utils/schemas/Pagination.schema';
import { SearchSchema } from '@/utils/schemas/Search.schema';
import { categories } from 'db/schema/categories';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from '@hono/zod-openapi';

export const CategorySchema = createSelectSchema(categories)
  .pick({
    id: true,
    name: true,
  })
  .openapi('Category')

export const CategoryRequestSchema = createInsertSchema(categories, {
  name: z.string({
    required_error: validationMessages.required('Name'),
    invalid_type_error: validationMessages.string('Name')
  }),
})
  .pick({
    name: true,
  })
  .openapi('CategoryRequest')

export const CategoryFilterSchema = SearchSchema
  .merge(PaginationSchema)
  .openapi('CategoryFilter')

export const CategoryResponseSchema = ApiResponseListSchema(CategorySchema, messages.successList('categories'))

export type Category = z.infer<typeof CategorySchema>
export type CategoryFilter = z.infer<typeof CategoryFilterSchema>
export type CategoryRequest = z.infer<typeof CategoryRequestSchema>