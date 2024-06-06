import { AccountMutationTypeEnum } from '@/enums/AccountMutationTypeEnum';
import { z } from 'zod';
import { DateRangeSchema } from '../DateRangeSchema';
import { PaginationSchema } from '../PaginationSchema';
import { SortSchema } from '../SortSchema';
import { accountsTable } from '@/db/schema/accounts';
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

export type AccountFilter = z.infer<typeof AccountFilterSchema>