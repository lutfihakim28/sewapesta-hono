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
    branchId: true,
    rentalTimeIncrement: true,
  })
  .openapi('Product')

export const ProductFilterSchema = z.object({
  branchId: NumericSchema('Branch ID').optional()
})
  .merge(SearchSchema)
  .merge(PaginationSchema)
  .merge(SortSchema<ProductColumn>([
    'id',
    'name',
    'rentalTimeIncrement',
  ]))
  .openapi('ProductFilter')

const ProductListSchema = z.array(ProductSchema)

export const ProductResponseListSchema = ApiResponseListSchema(ProductListSchema, messages.successList('products'))

export const ProductRequestSchema = createInsertSchema(products, {
  name: z.string({
    required_error: validationMessages.required('Name'),
    invalid_type_error: validationMessages.string('Name'),
  }),
  branchId: z.number({
    invalid_type_error: validationMessages.number('Branch ID'),
    required_error: validationMessages.required('Branch ID'),
  }),
  rentalTimeIncrement: z.number({
    invalid_type_error: validationMessages.number('Rental increment'),
    required_error: validationMessages.required('Rental increment'),
  }),
}).pick({
  branchId: true,
  rentalTimeIncrement: true,
  name: true,
}).openapi('ProductRequest')

export const ProductResponseDataSchema = ApiResponseDataSchema(ProductSchema, messages.successDetail('product'))

export type Product = z.infer<typeof ProductSchema>
export type ProductFilter = z.infer<typeof ProductFilterSchema>
export type ProductRequest = z.infer<typeof ProductRequestSchema>