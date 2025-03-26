import { itemMutations } from 'db/schema/item-mutations';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { ItemSchema } from '../items/Item.schema';
import { ProfileSchema } from '../users/User.schema';
import { z } from '@hono/zod-openapi';
import { ApiResponseDataSchema, ApiResponseListSchema } from '@/lib/schemas/ApiResponse.schema';
import { messages } from '@/lib/constants/messages';
import { ItemMutationTypeEnum } from '@/lib/enums/ItemMutationType.Enum';
import { PaginationSchema } from '@/lib/schemas/Pagination.schema';
import { SearchSchema } from '@/lib/schemas/Search.schema';
import { DateRangeSchema } from '@/lib/schemas/DateRange.schema';
import { SortSchema } from '@/lib/schemas/Sort.schema';
import { NumericSchema } from '@/lib/schemas/Numeric.schema';

export type ItemMutationColumn = keyof typeof itemMutations.$inferSelect

const ItemMutationSchema = createSelectSchema(itemMutations).pick({
  description: true,
  id: true,
  quantity: true,
  type: true,
  createdAt: true,
  itemId: true,
})

const ItemMutationExtendedSchema = ItemMutationSchema
  .omit({ itemId: true })
  .extend({
    item: ItemSchema,
    owner: ProfileSchema,
  })
  .openapi('ItemMutationExtended')

export const ItemMutationFilterSchema = z
  .object({
    itemId: NumericSchema('Item ID').optional(),
    branchId: NumericSchema('Branch ID').optional(),
    type: z.nativeEnum(ItemMutationTypeEnum).optional(),
  })
  .merge(PaginationSchema)
  .merge(SearchSchema)
  .merge(DateRangeSchema)
  .merge(SortSchema<ItemMutationColumn>([
    'createdAt',
    'id',
    'quantity',
    'type',
  ]))
  .openapi('ItemMutationFilter')

export const ItemMutationResponseListSchema = ApiResponseListSchema(z.array(ItemMutationExtendedSchema), messages.successList('Item Mutation'))
export const ItemMutationResponseDataSchema = ApiResponseDataSchema(ItemMutationSchema, messages.successDetail('Item Mutation'))

export const ItemMutationRequestSchema = createInsertSchema(itemMutations).pick({
  description: true,
  itemId: true,
  quantity: true,
  type: true,
}).openapi('ItemMutationRequest')

export type ItemMutation = z.infer<typeof ItemMutationSchema>
export type ItemMutationExtended = z.infer<typeof ItemMutationExtendedSchema>
export type ItemMutationFilter = z.infer<typeof ItemMutationFilterSchema>
export type ItemMutationRequest = z.infer<typeof ItemMutationRequestSchema>