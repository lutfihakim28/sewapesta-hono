import { AccountMutationTypeEnum } from '@/enums/AccountMutationTypeEnum';
import { z } from 'zod';
import { DateRangeSchema } from '../DateRangeSchema';
import { PaginationSchema } from '../PaginationSchema';
import { accountMutationsTable } from '@/db/schema/accountMutations';
import { SortSchema } from '../SortSchema';

const _AccountMutationFilterSchema = z.object({
  type: z.nativeEnum(AccountMutationTypeEnum).openapi({
    example: AccountMutationTypeEnum.Debit,
  }),
}).partial()

export type AccountMutationColumn = keyof typeof accountMutationsTable.$inferSelect;

const _SortSchema = SortSchema<AccountMutationColumn>(['id', 'accountId', 'type', 'amount', 'description', 'createdAt'] as const);

export const AccountMutationFilterSchema = _AccountMutationFilterSchema
  .merge(DateRangeSchema)
  .merge(PaginationSchema)
  .merge(_SortSchema)

export type AccountMutationFilter = z.infer<typeof AccountMutationFilterSchema>