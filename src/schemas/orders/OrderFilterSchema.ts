import { SortSchema } from '../SortSchema';
import { SearchSchema } from '../SearchSchema';
import { PaginationSchema } from '../PaginationSchema';
import { z } from 'zod';
import { orders } from 'db/schema/orders';
import { OrderStatusEnum } from '@/lib/enums/OrderStatusEnum';
import { validationMessages } from '@/lib/constants/validationMessage';
import { DateRangeSchema } from '../DateRangeSchema';

export type OrderColumn = keyof typeof orders.$inferSelect;

const _SortSchema = SortSchema<OrderColumn>([
  'createdAt',
  'id',
  'number',
  'startDate',
  'endDate'
] as const)

export const OrderFilterSchema = z.object({
  status: z.string().openapi({ example: 'Created-Done' })
}).partial()
  .merge(_SortSchema)
  .merge(DateRangeSchema)
  .merge(SearchSchema)
  .merge(PaginationSchema)
  .openapi('OrderFilter')

export type OrderFilter = z.infer<typeof OrderFilterSchema>