import { accountMutationsTable } from '@/db/schema/accountMutations';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export const AccountMutationRequestSchema = createInsertSchema(accountMutationsTable, {
  amount: z.number({
    message: 'Nominal harus diisi angka.',
  }).openapi({ example: 100000 }),
  accountId: z.number({
    message: 'ID akun harus diisi angka.',
  }).openapi({ example: 1 }),
  description: z.optional(z.string()),
}).pick({ amount: true, accountId: true, description: true }).openapi('AccountMutationRequest')

export type AccountMutationRequest = z.infer<typeof AccountMutationRequestSchema>