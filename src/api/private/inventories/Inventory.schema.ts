import { inventories } from 'db/schema/inventories';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { CategorySchema } from '../categories/Category.schema';
import { ItemSchema } from '../items/Item.schema';
import { UnitSchema } from '../units/Unit.schema';
import { UserExtendedSchema } from '../users/User.schema';
import { SearchSchema } from '@/utils/schemas/Search.schema';
import { PaginationSchema } from '@/utils/schemas/Pagination.schema';
import { SortSchema } from '@/utils/schemas/Sort.schema';
import { NumericSchema } from '@/utils/schemas/Numeric.schema';
import { validationMessages } from '@/utils/constants/validation-message';
import { ApiResponseDataSchema, ApiResponseListSchema } from '@/utils/schemas/ApiResponse.schema';
import { messages } from '@/utils/constants/messages';

export type InventoryColumn = keyof typeof inventories.$inferSelect;

export const InventorySchema = createSelectSchema(inventories).pick({
  id: true,
  itemId: true,
  ownerId: true,
}).openapi('Inventory')

const InventoryListItemSchema = InventorySchema.extend({
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
});

export type InventoryListColumn = keyof Pick<z.infer<typeof InventoryListItemSchema>, 'id' | 'item' | 'owner'>

export const sortableInventoryColumns: InventoryListColumn[] = [
  'id',
  'item',
  'owner'
]

export const InventoryListSchema = z.array(InventoryListItemSchema).openapi('InventoryList')

export const InventoryFilterSchema = SearchSchema
  .merge(PaginationSchema)
  .merge(SortSchema(sortableInventoryColumns))
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
  })
    .int({
      message: validationMessages.integer('Owner ID')
    })
    .positive({
      message: validationMessages.positiveNumber('Owner ID')
    }),
  itemId: z.number({
    invalid_type_error: validationMessages.number('Item ID'),
    required_error: validationMessages.required('Item ID')
  })
    .int({
      message: validationMessages.integer('Item ID')
    })
    .positive({
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
