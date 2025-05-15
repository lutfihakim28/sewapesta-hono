import { inventories } from 'db/schema/inventories';
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

export type InventoryColumn = keyof typeof inventories.$inferSelect;

export const InventorySchema = createSelectSchema(inventories).pick({
  id: true,
  itemId: true,
  ownerId: true,
}).openapi('Inventory')

export const InventoryListSchema = z.array(InventorySchema.extend({
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
})).openapi('InventoryList')

export const InventoryFilterSchema = SearchSchema
  .merge(PaginationSchema)
  .merge(SortSchema<InventoryColumn>([
    'id',
  ]))
  .extend({
    itemId: NumericSchema('Item ID', 1).optional(),
    ownerId: NumericSchema('Owner ID', 1).optional(),
    categoryId: NumericSchema('Category ID', 1).optional(),
  })
  .openapi('InventoryFilter')

export const InventoryRequestSchema = createInsertSchema(inventories, {
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
})
  .pick({
    itemId: true,
    ownerId: true,
  })
  .openapi('InventoryRequest')

export const InventoryResponseListSchema = ApiResponseListSchema(InventoryListSchema, messages.successList('inventory items'))
export const InventoryResponseDataSchema = ApiResponseDataSchema(InventorySchema, messages.successDetail('inventory item'))

export type Inventory = z.infer<typeof InventorySchema>
export type InventoryList = z.infer<typeof InventoryListSchema>
export type InventoryFilter = z.infer<typeof InventoryFilterSchema>
export type InventoryRequest = z.infer<typeof InventoryRequestSchema>
