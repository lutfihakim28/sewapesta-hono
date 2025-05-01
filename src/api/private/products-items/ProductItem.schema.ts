import { messages } from '@/lib/constants/messages';
import { validationMessages } from '@/lib/constants/validation-message';
import { OvertimeTypeEnum } from '@/lib/enums/OvertimeTypeEnum';
import { ApiResponseDataSchema, ApiResponseListSchema } from '@/lib/schemas/ApiResponse.schema';
import { NumericSchema } from '@/lib/schemas/Numeric.schema';
import { PaginationSchema } from '@/lib/schemas/Pagination.schema';
import { SortSchema } from '@/lib/schemas/Sort.schema';
import { productsItems } from 'db/schema/products-items';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { ItemSchema } from '../items/Item.schema';
import { ProductSchema } from '../products/Product.schema';

type ProductItemColumn = keyof typeof productsItems.$inferSelect;

const ProductItemSchema = createSelectSchema(productsItems).pick({
  overtimeMultiplier: true,
  overtimePrice: true,
  overtimeRatio: true,
  overtimeType: true,
  price: true,
  itemId: true,
  productId: true
}).openapi('ProductItem')

const ProductItemExtendedSchema = ProductItemSchema.omit({
  itemId: true,
  productId: true,
}).extend({
  item: ItemSchema,
  product: ProductSchema.omit({ branchName: true })
}).openapi('ProductItemExtended')

const Filter = PaginationSchema
  .merge(SortSchema<ProductItemColumn>([
    'itemId',
    'productId',
    'overtimeMultiplier',
    'overtimePrice',
    'overtimeType',
    'price',
  ]))

export const ProductItemFilterSchema = z.object({
  productId: NumericSchema('Product ID').optional(),
  itemId: NumericSchema('Item ID').optional(),
}).merge(Filter).openapi('ProductItemFilter')

const ProductItemListSchema = z.array(ProductItemExtendedSchema);

export const ProductItemResponseListSchema = ApiResponseListSchema(ProductItemListSchema, messages.successList('products items'))

export const ProductItemRequestSchema = createInsertSchema(productsItems, {
  itemId: z.number({
    invalid_type_error: validationMessages.number('Item ID'),
    required_error: validationMessages.required('Item ID'),
  }),
  productId: z.number({
    invalid_type_error: validationMessages.number('Product ID'),
    required_error: validationMessages.required('Product ID'),
  }),
  overtimeType: z.nativeEnum(OvertimeTypeEnum, {
    invalid_type_error: validationMessages.enum('Overtime type', OvertimeTypeEnum),
    required_error: validationMessages.required('Overtime type')
  }),
  overtimeMultiplier: z.number({
    invalid_type_error: validationMessages.number('Overtime multiplier')
  }),
  overtimePrice: z.number({
    invalid_type_error: validationMessages.number('Overtime price')
  }),
  overtimeRatio: z.number({
    invalid_type_error: validationMessages.number('Overtime ratio')
  }),
}).pick({
  itemId: true,
  overtimeMultiplier: true,
  overtimeRatio: true,
  overtimePrice: true,
  overtimeType: true,
  price: true,
  productId: true,
})

export const ProductItemResponseDataSchema = ApiResponseDataSchema(ProductItemSchema, messages.successDetail('product item'))

export type ProductItem = z.infer<typeof ProductItemSchema>
export type ProductItemExtended = z.infer<typeof ProductItemExtendedSchema>
export type ProductItemFilter = z.infer<typeof ProductItemFilterSchema>
export type ProductItemRequest = z.infer<typeof ProductItemRequestSchema>