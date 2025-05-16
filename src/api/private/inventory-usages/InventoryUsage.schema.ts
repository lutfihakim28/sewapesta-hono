import { inventoryUsages } from 'db/schema/inventory-usages';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { ItemSchema } from '../items/Item.schema';
import { UserExtendedSchema } from '../users/User.schema';
import { z } from 'zod';
import { PaginationSchema } from '@/utils/schemas/Pagination.schema';
import { SearchSchema } from '@/utils/schemas/Search.schema';
import { DateRangeSchema } from '@/utils/schemas/DateRange.schema';
import { SortSchema } from '@/utils/schemas/Sort.schema';
import { NumericSchema } from '@/utils/schemas/Numeric.schema';
import { ApiResponseDataSchema, ApiResponseListSchema } from '@/utils/schemas/ApiResponse.schema';
import { messages } from '@/utils/constants/messages';
import { validationMessages } from '@/utils/constants/validation-message';

export type inventoryUsageColumn = keyof typeof inventoryUsages.$inferSelect;

export const InventoryUsageSchema = createSelectSchema(inventoryUsages).pick({
  description: true,
  id: true,
  inventoryId: true,
  itemId: true,
  orderQuantity: true,
  returnAt: true,
  usedAt: true,
  returnQuantity: true,
}).openapi('InventoryUsage')

const InventoryUsageListItemSchema = InventoryUsageSchema.extend({
  item: ItemSchema.pick({ id: true, name: true }),
  owner: UserExtendedSchema.pick({ id: true, name: true }),
})

const InventoryUsageListSchema = z.array(InventoryUsageListItemSchema).openapi('InventoryUsageList')
export const InventoryUsageFilterSchema = PaginationSchema
  .merge(SearchSchema)
  .merge(DateRangeSchema)
  .extend({
    ownerId: NumericSchema('Owner ID', 1).optional(),
    itemId: NumericSchema('Owner ID', 1).optional(),
  })
  .openapi('InventoryUsageFilter')

export const InventoryUsageResponseListSchema = ApiResponseListSchema(InventoryUsageListSchema, messages.successList('inventory usages'))
export const InventoryUsageResponseDataSchema = ApiResponseDataSchema(InventoryUsageSchema, messages.successDetail('inventory usages'))

export const InventoryUsageRequestSchema = createInsertSchema(inventoryUsages, {
  description: z.string({
    invalid_type_error: validationMessages.string('Description'),
  }),
  inventoryId: z.number({
    invalid_type_error: validationMessages.number('Inventory ID'),
    required_error: validationMessages.required('Inventory ID')
  })
    .int({
      message: validationMessages.integer('Inventory ID'),
    })
    .positive({
      message: validationMessages.positiveNumber('Inventory ID')
    }),
  orderQuantity: z.number({
    invalid_type_error: validationMessages.number('Order quantity'),
    required_error: validationMessages.required('Order quantity')
  })
    .int({
      message: validationMessages.integer('Order quantity'),
    })
    .positive({
      message: validationMessages.positiveNumber('Order quantity')
    }),
  returnAt: z.number({
    invalid_type_error: validationMessages.number('Return at'),
    required_error: validationMessages.required('Return at')
  })
    .int({
      message: validationMessages.integer('Return at'),
    })
    .positive({
      message: validationMessages.positiveNumber('Return at')
    }),
  usedAt: z.number({
    invalid_type_error: validationMessages.number('Used at'),
    required_error: validationMessages.required('Used at')
  })
    .int({
      message: validationMessages.integer('Used at'),
    })
    .positive({
      message: validationMessages.positiveNumber('Used at')
    }),
  returnQuantity: z.number({
    invalid_type_error: validationMessages.number('Return quantity'),
    required_error: validationMessages.required('Return quantity')
  })
    .int({
      message: validationMessages.integer('Return quantity'),
    })
    .positive({
      message: validationMessages.positiveNumber('Return quantity')
    }),
}).pick({
  description: true,
  inventoryId: true,
  orderQuantity: true,
  returnAt: true,
  usedAt: true,
  returnQuantity: true,
}).openapi('InventoryUsageRequest')

export type InventoryUsage = z.infer<typeof InventoryUsageSchema>
export type InventoryUsageList = z.infer<typeof InventoryUsageListSchema>
export type InventoryUsageFilter = z.infer<typeof InventoryUsageFilterSchema>
export type InventoryUsageRequest = z.infer<typeof InventoryUsageRequestSchema>