import { stockMutations } from 'db/schema/stock-mutations';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { ItemSchema } from '../items/Item.schema';
import { ProfileSchema } from '../users/User.schema';
import { z } from '@hono/zod-openapi';
import { ApiResponseDataSchema, ApiResponseListSchema } from '@/lib/schemas/ApiResponse.schema';
import { messages } from '@/lib/constants/messages';
import { StockMutationTypeEnum } from '@/lib/enums/StockMutationType.Enum';
import { PaginationSchema } from '@/lib/schemas/Pagination.schema';
import { SearchSchema } from '@/lib/schemas/Search.schema';
import { DateRangeSchema } from '@/lib/schemas/DateRange.schema';
import { SortSchema } from '@/lib/schemas/Sort.schema';
import { NumericSchema } from '@/lib/schemas/Numeric.schema';

export type StockMutationColumn = keyof typeof stockMutations.$inferSelect

const StockMutationSchema = createSelectSchema(stockMutations).pick({
  description: true,
  id: true,
  quantity: true,
  type: true,
  mutateAt: true,
  itemOwnerId: true,
  affectItemQuantity: true,
})

const StockMutationExtendedSchema = StockMutationSchema
  .omit({ itemOwnerId: true })
  .extend({
    item: ItemSchema,
    owner: ProfileSchema,
  })
  .openapi('StockMutationExtended')

export const StockMutationFilterSchema = z
  .object({
    itemOwnerId: NumericSchema('Item owner ID').optional(),
    branchId: NumericSchema('Branch ID').optional(),
    type: z.nativeEnum(StockMutationTypeEnum).optional(),
  })
  .merge(PaginationSchema)
  .merge(SearchSchema)
  .merge(DateRangeSchema)
  .merge(SortSchema<StockMutationColumn>([
    'mutateAt',
    'id',
    'quantity',
    'type',
  ]))
  .openapi('StockMutationFilter')

export const StockMutationResponseListSchema = ApiResponseListSchema(z.array(StockMutationExtendedSchema), messages.successList('Item Mutation'))
export const StockMutationResponseDataSchema = ApiResponseDataSchema(StockMutationExtendedSchema, messages.successDetail('Item Mutation'))

export const StockMutationRequestSchema = createInsertSchema(stockMutations).pick({
  affectItemQuantity: true,
  itemOwnerId: true,
  description: true,
  quantity: true,
  type: true,
}).openapi('StockMutationRequest')

export type StockMutation = z.infer<typeof StockMutationSchema>
export type StockMutationExtended = z.infer<typeof StockMutationExtendedSchema>
export type StockMutationFilter = z.infer<typeof StockMutationFilterSchema>
export type StockMutationRequest = z.infer<typeof StockMutationRequestSchema>