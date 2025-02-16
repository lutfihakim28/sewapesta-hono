import { z } from 'zod';
import { PaginationSchema } from '../PaginationSchema';
import { SortSchema } from '../SortSchema';
import { SearchSchema } from '../SearchSchema';
import { items } from 'db/schema/items';

export type ItemColumn = keyof typeof items.$inferSelect;

const _SortSchema = SortSchema<ItemColumn>([
  'id',
  'name',
  'quantity',
]);

export const ItemFilterSchema = z.object({
  categories: z.string().openapi({ example: '1-2-10', description: 'category id, can be multiple id separated by dash (-)' })
}).partial()
  .merge(_SortSchema)
  .merge(SearchSchema)
  .merge(PaginationSchema)
  .openapi('ItemFilter')

export type ItemFilter = z.infer<typeof ItemFilterSchema>