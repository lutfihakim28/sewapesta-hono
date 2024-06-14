import { accountMutationsTable } from 'db/schema/accountMutations';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const AccountMutationSchema = createSelectSchema(accountMutationsTable, {
  createdAt: z.string().openapi({
    example: '28 Agustus 2024 15:28:30',
    description: 'Datetime format'
  })
}).openapi('AccountMutation');

export type AccountMutation = z.infer<typeof AccountMutationSchema>