import { inventoryItems } from 'db/schema/inventory-items';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { CategorySchema } from '../categories/Category.schema';
import { ItemSchema } from '../items/Item.schema';
import { UnitSchema } from '../units/Unit.schema';
import { UserExtendedSchema } from '../users/User.schema';
import { SearchSchema } from '@/lib/schemas/Search.schema';
import { PaginationSchema } from '@/lib/schemas/Pagination.schema';
import { SortSchema } from '@/lib/schemas/Sort.schema';
import { NumericSchema } from '@/lib/schemas/Numeric.schema';
import { validationMessages } from '@/lib/constants/validation-message';
import { ApiResponseDataSchema, ApiResponseListSchema } from '@/lib/schemas/ApiResponse.schema';
import { messages } from '@/lib/constants/messages';

export type InventoryItemColumn = keyof typeof inventoryItems.$inferSelect;

export const InventoryItemSchema = createSelectSchema(inventoryItems).pick({
  id: true,
  itemId: true,
  ownerId: true,
  totalQuantity: true,
}).openapi('InventoryItem')

export const InventoryItemListSchema = z.array(InventoryItemSchema.extend({
  item: ItemSchema.pick({
    id: true,
    name: true,
    type: true
  }),
  category: CategorySchema,
  unit: UnitSchema,
  owner: UserExtendedSchema.pick({
    id: true,
    phone: true,
    name: true,
  })
})).openapi('InventoryItemList')

export const InventoryItemFilterSchema = SearchSchema
  .merge(PaginationSchema)
  .merge(SortSchema<InventoryItemColumn>([
    'id',
    'totalQuantity',
  ]))
  .extend({
    itemId: NumericSchema('Item ID', 1).optional(),
    ownerId: NumericSchema('Owner ID', 1).optional(),
    categoryId: NumericSchema('Category ID', 1).optional(),
  })
  .openapi('InventoryItemFilter')

export const InventoryItemRequestSchema = createInsertSchema(inventoryItems, {
  ownerId: z.number({
    invalid_type_error: validationMessages.number('Owner ID'),
    required_error: validationMessages.required('Owner ID')
  }).positive({
    message: validationMessages.positiveNumber('Owner ID')
  }),
  itemId: z.number({
    invalid_type_error: validationMessages.number('Item ID'),
    required_error: validationMessages.required('Item ID')
  }).positive({
    message: validationMessages.positiveNumber('Item ID')
  }),
  totalQuantity: z.number({
    invalid_type_error: validationMessages.number('Total quantity'),
    required_error: validationMessages.required('Total quantity')
  }).positive({
    message: validationMessages.positiveNumber('Total quantity')
  }),
})
  .pick({
    itemId: true,
    ownerId: true,
    totalQuantity: true,
  })
  .openapi('InventoryItemRequest')

export const InventoryItemResponseListSchema = ApiResponseListSchema(InventoryItemListSchema, messages.successList('inventory items'))
export const InventoryItemResponseDataSchema = ApiResponseDataSchema(InventoryItemSchema, messages.successDetail('inventory item'))

export type InventoryItem = z.infer<typeof InventoryItemSchema>
export type InventoryItemList = z.infer<typeof InventoryItemListSchema>
export type InventoryItemFilter = z.infer<typeof InventoryItemFilterSchema>
export type InventoryItemRequest = z.infer<typeof InventoryItemRequestSchema>
