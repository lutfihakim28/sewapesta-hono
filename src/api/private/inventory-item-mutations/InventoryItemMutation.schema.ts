import { inventoryItemMutations } from 'db/schema/inventory-item-mutations';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { ItemSchema } from '../items/Item.schema';
import { UserExtendedSchema } from '../users/User.schema';
import { SearchSchema } from '@/lib/schemas/Search.schema';
import { PaginationSchema } from '@/lib/schemas/Pagination.schema';
import { NumericSchema } from '@/lib/schemas/Numeric.schema';
import { validationMessages } from '@/lib/constants/validation-message';
import { StockMutationTypeEnum } from '@/lib/enums/StockMutationType.Enum';
import { ApiResponseDataSchema, ApiResponseListSchema } from '@/lib/schemas/ApiResponse.schema';
import { messages } from '@/lib/constants/messages';

export type InventoryItemMutaionColumn = keyof typeof inventoryItemMutations.$inferSelect

export const InventoryItemMutationSchema = createSelectSchema(inventoryItemMutations)
  .pick({
    description: true,
    id: true,
    inventoryItemId: true,
    itemId: true,
    mutateAt: true,
    quantity: true,
    type: true,
  })
  .openapi('InventoryItemMutation')

export const InventoryItemMutationListSchema = z.array(InventoryItemMutationSchema.extend({
  item: ItemSchema.pick({
    id: true,
    name: true,
  }),
  owner: UserExtendedSchema.pick({
    id: true,
    name: true,
  })
})).openapi('InventoryItemMutationList')

export const InventoryItemMutationFilterSchema = SearchSchema
  .merge(PaginationSchema)
  .extend({
    inventoryItemId: NumericSchema('Inventory item ID').optional(),
    itemId: NumericSchema('Item ID').optional(),
  })
  .openapi('InventoryItemMutationFilter')

export const InventoryItemMutationRequestSchema = createInsertSchema(inventoryItemMutations, {
  description: z.string({
    invalid_type_error: validationMessages.string('Description')
  }).optional(),
  inventoryItemId: z.number({
    invalid_type_error: validationMessages.number('Inventory item ID'),
    required_error: validationMessages.required('Inventory item ID')
  }).positive({
    message: validationMessages.positiveNumber('Inventory item ID')
  }),
  quantity: z.number({
    invalid_type_error: validationMessages.number('Quantity'),
    required_error: validationMessages.required('Quantity')
  }).positive({
    message: validationMessages.positiveNumber('Quantity')
  }),
  type: z.nativeEnum(StockMutationTypeEnum, {
    invalid_type_error: validationMessages.enum('Type', StockMutationTypeEnum),
    required_error: validationMessages.required('Type')
  })
}).pick({
  description: true,
  inventoryItemId: true,
  quantity: true,
  type: true,
}).openapi('InventoryMutationRequest')

export const InventoryItemMutationResponseListSchema = ApiResponseListSchema(InventoryItemMutationListSchema, messages.successList('inventory item mutations'))
export const InventoryItemMutationResponseDataSchema = ApiResponseDataSchema(InventoryItemMutationSchema, messages.successDetail('inventory item mutation'))

export type InventoryItemMutation = z.infer<typeof InventoryItemMutationSchema>
export type InventoryItemMutationList = z.infer<typeof InventoryItemMutationListSchema>
export type InventoryItemMutationFilter = z.infer<typeof InventoryItemMutationFilterSchema>
export type InventoryItemMutationRequest = z.infer<typeof InventoryItemMutationRequestSchema>
