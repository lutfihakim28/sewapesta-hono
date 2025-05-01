import { itemsOwners } from 'db/schema/items-owners';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { ItemSchema } from '../items/Item.schema';
import { UserSchema } from '../users/User.schema';
import { PaginationSchema } from '@/lib/schemas/Pagination.schema';
import { SortSchema } from '@/lib/schemas/Sort.schema';
import { z } from 'zod';
import { NumericSchema } from '@/lib/schemas/Numeric.schema';
import { SearchSchema } from '@/lib/schemas/Search.schema';
import { ApiResponseDataSchema, ApiResponseListSchema } from '@/lib/schemas/ApiResponse.schema';
import { messages } from '@/lib/constants/messages';
import { validationMessages } from '@/lib/constants/validation-message';

export type ItemOwnerColumn = keyof typeof itemsOwners.$inferSelect

const ItemOwnerSchema = createSelectSchema(itemsOwners).pick({
  id: true,
  quantity: true,
  itemId: true,
  ownerId: true,
}).openapi('ItemOwner')

const ItemOwnerExtendedSchema = ItemOwnerSchema.omit({
  itemId: true,
  ownerId: true,
}).extend({
  item: ItemSchema,
  owner: UserSchema,
}).openapi('ItemOwnerExtended')

const Filter = PaginationSchema
  .merge(SearchSchema)
  .merge(SortSchema<ItemOwnerColumn>([
    'id',
    'itemId',
    'ownerId',
    'quantity',
  ]))

export const ItemOwnerFilterSchema = z.object({
  itemId: NumericSchema('Item ID').optional(),
  ownerId: NumericSchema('Owner ID').optional(),
  branchId: NumericSchema('Branch ID').optional(),
}).merge(Filter).openapi('ItemOwnerFilter')

const ItemOwnerListSchema = z.array(ItemOwnerSchema)

export const ItemOwnerResponseListSchema = ApiResponseListSchema(ItemOwnerListSchema, messages.successList('items owners'))

export const ItemOwnerRequestSchema = createInsertSchema(itemsOwners, {
  itemId: z.number({
    invalid_type_error: validationMessages.number('Item ID'),
    required_error: validationMessages.required('Item ID'),
  }),
  ownerId: z.number({
    invalid_type_error: validationMessages.number('Owner ID'),
    required_error: validationMessages.required('Owner ID'),
  }),
  quantity: z.number({
    invalid_type_error: validationMessages.number('Quantity'),
    required_error: validationMessages.required('Quantity'),
  }),
}).pick({
  itemId: true,
  ownerId: true,
  quantity: true,
})

export const ItemOwnerUpdateRequestSchema = ItemOwnerRequestSchema.omit({
  itemId: true,
  ownerId: true
})

export const ItemOwnerResponseDataSchema = ApiResponseDataSchema(ItemOwnerSchema, messages.successDetail('item owner'))

export type ItemOwner = z.infer<typeof ItemOwnerSchema>
export type ItemOwnerExtended = z.infer<typeof ItemOwnerExtendedSchema>
export type ItemOwnerFilter = z.infer<typeof ItemOwnerFilterSchema>
export type ItemOwnerRequest = z.infer<typeof ItemOwnerRequestSchema>
export type ItemOwnerUpdateRequest = z.infer<typeof ItemOwnerUpdateRequestSchema>