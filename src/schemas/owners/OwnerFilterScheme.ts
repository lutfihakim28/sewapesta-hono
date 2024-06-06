import { SortSchema } from '../SortSchema';
import { SearchSchema } from '../SearchSchema';
import { PaginationSchema } from '../PaginationSchema';
import { z } from 'zod';
import { ownersTable } from '@/db/schema/owners';

export type OwnerColumn = keyof typeof ownersTable.$inferSelect;

const _SortSchema = SortSchema<OwnerColumn>([
  'createdAt',
  'id',
  'name',
  'phone',
] as const)

export const OwnerFilterSchema = _SortSchema
  .merge(SearchSchema)
  .merge(PaginationSchema)

export type OwnerFilter = z.infer<typeof OwnerFilterSchema>