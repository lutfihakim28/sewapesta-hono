import { messages } from '@/lib/constants/messages';
import { validationMessages } from '@/lib/constants/validationMessage';
import { ApiResponseListSchema } from '@/lib/schemas/ApiResponse.schema';
import { PaginationSchema } from '@/lib/schemas/Pagination.schema';
import { SearchSchema } from '@/lib/schemas/Search.schema';
import { categories } from 'db/schema/categories';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const CategorySchema = createSelectSchema(categories)
  .pick({
    id: true,
    name: true,
  })
  .openapi('Category')

export const CategoryRequestSchema = createInsertSchema(categories, {
  name: z.string({ message: validationMessages.required('Name') }),
  branchId: z.number({ message: validationMessages.requiredNumber('Branch ID') })
})
  .pick({
    name: true,
    branchId: true,
  })
  .openapi('CategoryRequest')

export const CategoryFilterSchema = z.object({
  branchId: z.number(),
}).merge(SearchSchema)
  .merge(PaginationSchema)
  .openapi('CategoryFilter')

export const CategoryResponseSchema = ApiResponseListSchema(CategorySchema, messages.successList('categories'))

export type Category = z.infer<typeof CategorySchema>
export type CategoryFilter = z.infer<typeof CategoryFilterSchema>
export type CategoryRequest = z.infer<typeof CategoryRequestSchema>