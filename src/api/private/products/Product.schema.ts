import { messages } from '@/lib/constants/messages';
import { validationMessages } from '@/lib/constants/validationMessage';
import { ApiResponseDataSchema, ApiResponseListSchema } from '@/lib/schemas/ApiResponse.schema';
import { PaginationSchema } from '@/lib/schemas/Pagination.schema';
import { SearchSchema } from '@/lib/schemas/Search.schema';
import { z } from '@hono/zod-openapi';
import { products } from 'db/schema/products';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { BranchExtendedSchema } from '../branches/Branch.schema';
import { SortSchema } from '@/lib/schemas/Sort.schema';

export type ProductColumn = keyof typeof products.$inferSelect

export const ProductSchema = createSelectSchema(products)
  .pick({
    id: true,
    name: true,
    branchId: true,
    rentalTimeIncrement: true,
  })
  .openapi('Product')

export const ProductExtendedSchema = ProductSchema
  .omit({
    branchId: true,
  })
  .extend({
    branch: BranchExtendedSchema,
  })
  .openapi('ProductExtended')

export const ProductFilterSchema = z
  .object({
    branchId: z.number(),
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
  name: z.string({ message: validationMessages.required('Name') }),
  branchId: z.number({ message: validationMessages.requiredNumber('Branch ID') }),
  rentalTimeIncrement: z.number({ message: validationMessages.requiredNumber('Rental increment') }),
}).pick({
  branchId: true,
  rentalTimeIncrement: true,
  name: true,
}).openapi('ProductRequest')

export const ProductResponseExtendedDataSchema = ApiResponseDataSchema(ProductExtendedSchema, messages.successDetail('product'))
export const ProductResponseDataSchema = ApiResponseDataSchema(ProductSchema, messages.successDetail('product'))

export type Product = z.infer<typeof ProductSchema>
export type ProductExtended = z.infer<typeof ProductExtendedSchema>
export type ProductFilter = z.infer<typeof ProductFilterSchema>
export type ProductRequest = z.infer<typeof ProductRequestSchema>