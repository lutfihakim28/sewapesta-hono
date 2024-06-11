import { z } from 'zod';
import { PaginationSchema } from '../PaginationSchema';
import { SortSchema } from '../SortSchema';
import { SearchSchema } from '../SearchSchema';
import { itemsTable } from '@/db/schema/items';

export type ItemColumn = keyof typeof itemsTable.$inferSelect;

const _SortSchema = SortSchema<ItemColumn>([
  'id',
  'name',
  'quantity',
] as const);

export const ItemFilterSchema = z.object({
  subcategory: z.string()
}).partial()
  .merge(_SortSchema)
  .merge(SearchSchema)
  .merge(PaginationSchema)
  .openapi('ItemFilter')

export type ItemFilter = z.infer<typeof ItemFilterSchema>