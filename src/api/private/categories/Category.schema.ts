import { messages } from '@/utils/constants/messages';
import { ApiResponseListSchema } from '@/utils/schemas/ApiResponse.schema';
import { PaginationSchema } from '@/utils/schemas/Pagination.schema';
import { SearchSchema } from '@/utils/schemas/Search.schema';
import { categories } from 'db/schema/categories';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { StringSchema } from '@/utils/schemas/String.schema';
import { SchemaType } from '@/utils/types/Schema.type';

export const CategorySchema = createSelectSchema(categories)
  .pick({
    id: true,
    name: true,
  })
  .openapi('Category')

export const CategoryRequestSchema = createInsertSchema(categories, {
  name: new StringSchema('Name').getSchema(),
})
  .pick({
    name: true,
  })
  .openapi('CategoryRequest')

export const CategoryFilterSchema = SearchSchema
  .merge(PaginationSchema)
  .openapi('CategoryFilter')

export const CategoryResponseSchema = ApiResponseListSchema(CategorySchema, messages.successList('categories'))

export type Category = SchemaType<typeof CategorySchema>
export type CategoryFilter = SchemaType<typeof CategoryFilterSchema>
export type CategoryRequest = SchemaType<typeof CategoryRequestSchema>