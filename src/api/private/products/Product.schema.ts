import { messages } from '@/lib/constants/messages';
import { validationMessages } from '@/lib/constants/validation-message';
import { ApiResponseDataSchema, ApiResponseListSchema } from '@/lib/schemas/ApiResponse.schema';
import { PaginationSchema } from '@/lib/schemas/Pagination.schema';
import { SearchSchema } from '@/lib/schemas/Search.schema';
import { z } from '@hono/zod-openapi';
import { products } from 'db/schema/products';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { SortSchema } from '@/lib/schemas/Sort.schema';
import { NumericSchema } from '@/lib/schemas/Numeric.schema';

export type ProductColumn = keyof typeof products.$inferSelect

export const ProductSchema = createSelectSchema(products)
  .pick({
    id: true,
    name: true,
  })
  .openapi('Product')

export type ProductListColumn = keyof Pick<z.infer<typeof ProductSchema>, 'id' |
  'name'>;
export const sortableProductColumn: ProductListColumn[] = [
  'id',
  'name'
]

export const ProductFilterSchema = z.object({
  branchId: NumericSchema('Branch ID').optional()
})
  .merge(SearchSchema)
  .merge(PaginationSchema)
  .merge(SortSchema(sortableProductColumn))
  .openapi('ProductFilter')

const ProductListSchema = z.array(ProductSchema)

export const ProductResponseListSchema = ApiResponseListSchema(ProductListSchema, messages.successList('products'))

export const ProductRequestSchema = createInsertSchema(products, {
  name: z.string({
    required_error: validationMessages.required('Name'),
    invalid_type_error: validationMessages.string('Name'),
  }),
}).pick({
  name: true,
}).openapi('ProductRequest')

export const ProductResponseDataSchema = ApiResponseDataSchema(ProductSchema, messages.successDetail('product'))

export type Product = z.infer<typeof ProductSchema>
export type ProductFilter = z.infer<typeof ProductFilterSchema>
export type ProductRequest = z.infer<typeof ProductRequestSchema>