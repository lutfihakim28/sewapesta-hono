import { NumericSchema } from '@/lib/schemas/Numeric.schema';
import { items } from 'db/schema/items';
import { productsItems } from 'db/schema/products-items';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from '@hono/zod-openapi';
import { OvertimeTypeEnum } from '@/lib/enums/OvertimeTypeEnum';
import { SearchSchema } from '@/lib/schemas/Search.schema';
import { PaginationSchema } from '@/lib/schemas/Pagination.schema';
import { SortSchema } from '@/lib/schemas/Sort.schema';
import { ProfileSchema } from '../users/User.schema';
import { ApiResponseDataSchema, ApiResponseListSchema } from '@/lib/schemas/ApiResponse.schema';
import { messages } from '@/lib/constants/messages';
import { validationMessages } from '@/lib/constants/validation-message';
import { ImageSchema } from '../images/Image.schema';
import { itemsOwners } from 'db/schema/items-owners';
import { BooleanQuerySchema } from '@/lib/schemas/BooleanQuery.schema';

export type ItemColumn = keyof typeof items.$inferSelect
export type ProductItemColumn = keyof typeof productsItems.$inferSelect

export const ItemSchema = createSelectSchema(items).pick({
  categoryId: true,
  id: true,
  name: true,
  unitId: true,
}).openapi('Item')

export const ItemListSchema = ItemSchema.omit({
  categoryId: true,
  unitId: true,
}).extend({
  category: z.string(),
  unit: z.string(),
  totalQuantity: z.number(),
  availableQuantity: z.number(),
  ownedBy: z.number(),
}).openapi('ItemList')

const ItemOwner = createSelectSchema(itemsOwners).pick({
  id: true
}).extend({
  profile: ProfileSchema,
  quantity: z.number(),
}).openapi('ItemOwner')

export const ProductItemSchema = createSelectSchema(productsItems).pick({
  productId: true,
  overtimeMultiplier: true,
  overtimePrice: true,
  overtimeRatio: true,
  overtimeType: true,
}).openapi('ProductItem')

const ItemExtendedSchema = ItemSchema.extend({
  products: z.array(ProductItemSchema),
  owner: z.array(ItemOwner),
  quantity: z.number(),
  images: z.array(ImageSchema)
})
  .openapi('ItemExtended')

export type ItemSort = ItemColumn | 'totalQuantity' | 'availableQuantity' | 'ownedBy'

export const ItemFilterSchema = z.object({
  categoryId: NumericSchema('Category ID').optional(),
  ownerId: NumericSchema('Owner ID').optional(),
  branchId: NumericSchema('Branch ID').optional(),
  hideUnavailable: BooleanQuerySchema('hideUnavailable'),
})
  .merge(SearchSchema)
  .merge(PaginationSchema)
  .merge(SortSchema<ItemSort>([
    'id',
    'name',
    'availableQuantity',
    'totalQuantity',
    'ownedBy'
  ]))
  .openapi('ItemFilter')

export const ItemResponseListSchema = ApiResponseListSchema(ItemListSchema, messages.successList('Item'))
export const ItemResponseDataSchema = ApiResponseDataSchema(ItemExtendedSchema, messages.successDetail('Item'))

const ProductItemRequestSchema = createInsertSchema(productsItems, {
  productId: z.number({
    invalid_type_error: validationMessages.number('Product ID'),
    required_error: validationMessages.required('Product ID'),
  }),
  overtimeMultiplier: z.number({
    invalid_type_error: validationMessages.number('Overtime Multiplier'),
    required_error: validationMessages.required('Price'),
  }),
  overtimePrice: z.number({
    invalid_type_error: validationMessages.number('Overtime Price'),
    required_error: validationMessages.required('Overtime Price'),
  }),
  overtimeRatio: z.number({
    invalid_type_error: validationMessages.number('Overtime Ratio'),
    required_error: validationMessages.required('Overtime Ratio'),
  }),
  overtimeType: z.nativeEnum(OvertimeTypeEnum, {
    invalid_type_error: validationMessages.enum('Overtime Type', OvertimeTypeEnum),
    required_error: validationMessages.required('Overtime Type'),
  }),
  price: z.number({
    invalid_type_error: validationMessages.number('Price'),
    required_error: validationMessages.required('Price'),
  }),
}).pick({
  productId: true,
  overtimeMultiplier: true,
  overtimePrice: true,
  overtimeRatio: true,
  overtimeType: true,
  price: true
}).openapi('ProductItemRequest')

const ItemOwnerRequestSchema = createInsertSchema(itemsOwners, {
  ownerId: z.number({
    invalid_type_error: validationMessages.number('Owner\'s User ID'),
    required_error: validationMessages.required('Owner\'s User ID'),
  }),
}).pick({ ownerId: true }).extend({
  quantity: z.number({
    invalid_type_error: validationMessages.number('Quantity'),
    required_error: validationMessages.required('Quantity'),
  }),
}).openapi('ItemOwnerRequest')

export const ItemRequestSchema = createInsertSchema(items, {
  categoryId: z.number({
    invalid_type_error: validationMessages.number('Category ID'),
    required_error: validationMessages.required('Category ID'),
  }),
  name: z.string({
    invalid_type_error: validationMessages.string('Name'),
    required_error: validationMessages.required('Name')
  }),
  unitId: z.number({
    invalid_type_error: validationMessages.number('Unit ID'),
    required_error: validationMessages.required('Unit ID'),
  }),
})
  .pick({
    categoryId: true,
    name: true,
    unitId: true,
  })
  .extend({
    products: z.array(z.union([ProductItemRequestSchema, z.number()]), {
      invalid_type_error: validationMessages.array('Products'),
      required_error: validationMessages.required('Products')
    }),
    owners: z.array(z.union([ItemOwnerRequestSchema, z.number()]), {
      invalid_type_error: validationMessages.array('Owners'),
      required_error: validationMessages.required('Owners')
    }),
    images: z.array(z.union([z.number(), z.string()]))
  })
  .openapi('ItemRequest')

export type ItemList = z.infer<typeof ItemListSchema>
export type ItemExtended = z.infer<typeof ItemExtendedSchema>
export type ItemFilter = z.infer<typeof ItemFilterSchema>
export type ItemRequest = z.infer<typeof ItemRequestSchema>
export type ProductItem = z.infer<typeof ProductItemSchema>
