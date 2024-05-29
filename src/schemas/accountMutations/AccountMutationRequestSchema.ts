import { accountMutationsTable } from '@/db/schema/accountMutations';
import { AccountMutationTypeEnum } from '@/enums/AccountMutationTypeEnum';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export const AccountMutationRequestSchema = createInsertSchema(accountMutationsTable, {
  type: z.enum([
    AccountMutationTypeEnum.Debit,
    AccountMutationTypeEnum.Credit,
  ], {
    message: 'Tipe mutasi akun harus diisi.'
  }).openapi({
    examples: [AccountMutationTypeEnum.Credit, AccountMutationTypeEnum.Debit]
  }),
  amount: z.number({
    message: 'Nominal harus diisi angka.',
  }).openapi({ example: 100000 }),
  accountId: z.number({
    message: 'ID akun harus diisi angka.',
  }).openapi({ example: 1 }),
  description: z.optional(z.string()),
}).pick({ type: true, amount: true, accountId: true, description: true }).openapi('AccountMutationRequest')

export type AccountMutationRequest = z.infer<typeof AccountMutationRequestSchema>