import { items } from 'db/schema/items';
import { productsItems } from 'db/schema/productsItems';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { OvertimeTypeEnum } from '@/lib/enums/OvertimeTypeEnum';
import { SearchSchema } from '@/lib/schemas/Search.schema';
import { PaginationSchema } from '@/lib/schemas/Pagination.schema';
import { SortSchema } from '@/lib/schemas/Sort.schema';
import { UserExtendedSchema } from '../users/User.schema';
import { ApiResponseDataSchema, ApiResponseListSchema } from '@/lib/schemas/ApiResponse.schema';
import { messages } from '@/lib/constants/messages';
import { validationMessages } from '@/lib/constants/validationMessage';
import { ImageSchema } from '../images/Image.schema';
import { NumericSchema } from '@/lib/schemas/Numeric.schema';

export type ItemColumn = keyof typeof items.$inferSelect
export type ProductItemColumn = keyof typeof productsItems.$inferSelect

export const ItemSchema = createSelectSchema(items).pick({
  categoryId: true,
  id: true,
  name: true,
  ownerId: true,
  price: true,
  quantity: true,
  unitId: true,
}).openapi('Item')

export const ProductItemSchema = createSelectSchema(productsItems).pick({
  productId: true,
  overtimeMultiplier: true,
  overtimePrice: true,
  overtimeRatio: true,
  overtimeType: true,
}).openapi('ProductItem')

export const ItemExtendedSchema = ItemSchema.omit({
  ownerId: true,
}).extend({
  products: z.array(ProductItemSchema),
  owner: UserExtendedSchema,
  images: z.array(ImageSchema)
})
  .openapi('ItemExtended')

export const ItemFilterSchema = z.object({
  categoryId: z.number().optional(),
  ownerId: z.number().optional(),
  productId: z.number().optional(),
  branchId: z.number().optional(),
  minPrice: NumericSchema('Min. Price').optional(),
  maxPrice: NumericSchema('Max. Price').optional(),
  overtimeType: z.nativeEnum(OvertimeTypeEnum).optional(),
})
  .merge(SearchSchema)
  .merge(PaginationSchema)
  .merge(SortSchema<ItemColumn | ProductItemColumn>([
    'price',
    'quantity',
    'overtimeMultiplier',
    'overtimePrice',
    'overtimeRatio',
    'overtimeType'
  ]))
  .openapi('ItemFilter')

export const ItemListSchema = ApiResponseListSchema(ItemExtendedSchema, messages.successList('Item'))
export const ItemDetailSchema = ApiResponseDataSchema(ItemExtendedSchema, messages.successDetail('Item'))

const ProductItemRequestSchema = createInsertSchema(productsItems, {
  productId: z.number({
    invalid_type_error: validationMessages.number('Product ID'),
    required_error: validationMessages.required('Product ID'),
  }),
  overtimeMultiplier: NumericSchema('Overime Multiplier'),
  overtimePrice: NumericSchema('Overtime Price'),
  overtimeRatio: NumericSchema('Overtime Ratio'),
  overtimeType: z.nativeEnum(OvertimeTypeEnum, {
    invalid_type_error: validationMessages.enum('Overtime Type', OvertimeTypeEnum),
    required_error: validationMessages.required('Overtime Type'),
  })
}).pick({
  productId: true,
  overtimeMultiplier: true,
  overtimePrice: true,
  overtimeRatio: true,
  overtimeType: true
})

export const ItemRequestSchema = createInsertSchema(items, {
  categoryId: z.number({
    invalid_type_error: validationMessages.number('Category ID'),
    required_error: validationMessages.required('Category ID'),
  }),
  name: z.string({
    invalid_type_error: validationMessages.string('Name'),
    required_error: validationMessages.required('Name')
  }),
  ownerId: z.number({
    invalid_type_error: validationMessages.number('Owner ID'),
    required_error: validationMessages.required('Owner ID'),
  }),
  quantity: z.number({
    invalid_type_error: validationMessages.number('Quantity'),
    required_error: validationMessages.required('Quantity'),
  }),
  unitId: z.number({
    invalid_type_error: validationMessages.number('Unit ID'),
    required_error: validationMessages.required('Unit ID'),
  }),
  price: NumericSchema('Price'),
})
  .pick({
    categoryId: true,
    name: true,
    ownerId: true,
    price: true,
    quantity: true,
    unitId: true,
  })
  .extend({
    products: z.array(ProductItemRequestSchema, {
      invalid_type_error: validationMessages.array('Products'),
      required_error: validationMessages.required('Products')
    }),
    images: z.array(z.union([z.number(), z.string()]))
  })
  .openapi('ItemRequest')

export type ItemExtended = z.infer<typeof ItemExtendedSchema>
export type ItemFilter = z.infer<typeof ItemFilterSchema>
export type ItemRequest = z.infer<typeof ItemRequestSchema>