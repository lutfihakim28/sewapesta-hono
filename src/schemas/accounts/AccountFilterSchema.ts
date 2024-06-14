import { z } from 'zod';
import { PaginationSchema } from '../PaginationSchema';
import { SortSchema } from '../SortSchema';
import { accountsTable } from 'db/schema/accounts';
import { SearchSchema } from '../SearchSchema';

export type AccountColumn = keyof typeof accountsTable.$inferSelect;

const _SortSchema = SortSchema<AccountColumn>([
  'id',
  'name',
  'balance',
  'createdAt',
  'updatedAt',
] as const);

export const AccountFilterSchema = _SortSchema
  .merge(SearchSchema)
  .merge(PaginationSchema)
  .openapi('AccountFilter')

export type AccountFilter = z.infer<typeof AccountFilterSchema>