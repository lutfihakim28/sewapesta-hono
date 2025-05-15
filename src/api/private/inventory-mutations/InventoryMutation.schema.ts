import { inventoryMutations } from 'db/schema/inventory-mutations';
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

export type InventoryMutaionColumn = keyof typeof inventoryMutations.$inferSelect

export const InventoryMutationSchema = createSelectSchema(inventoryMutations)
  .pick({
    description: true,
    id: true,
    inventoryId: true,
    itemId: true,
    mutateAt: true,
    quantity: true,
    type: true,
  })
  .openapi('InventoryMutation')

export const InventoryMutationListSchema = z.array(InventoryMutationSchema.extend({
  item: ItemSchema.pick({
    id: true,
    name: true,
  }),
  owner: UserExtendedSchema.pick({
    id: true,
    name: true,
  })
})).openapi('InventoryMutationList')

export const InventoryMutationFilterSchema = SearchSchema
  .merge(PaginationSchema)
  .extend({
    inventoryId: NumericSchema('Inventory item ID').optional(),
    itemId: NumericSchema('Item ID').optional(),
  })
  .openapi('InventoryMutationFilter')

export const InventoryMutationRequestSchema = createInsertSchema(inventoryMutations, {
  description: z.string({
    invalid_type_error: validationMessages.string('Description')
  }).optional(),
  inventoryId: z.number({
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
  inventoryId: true,
  quantity: true,
  type: true,
}).openapi('InventoryMutationRequest')

export const InventoryMutationResponseListSchema = ApiResponseListSchema(InventoryMutationListSchema, messages.successList('inventory item mutations'))
export const InventoryMutationResponseDataSchema = ApiResponseDataSchema(InventoryMutationSchema, messages.successDetail('inventory item mutation'))

export type InventoryMutation = z.infer<typeof InventoryMutationSchema>
export type InventoryMutationList = z.infer<typeof InventoryMutationListSchema>
export type InventoryMutationFilter = z.infer<typeof InventoryMutationFilterSchema>
export type InventoryMutationRequest = z.infer<typeof InventoryMutationRequestSchema>
