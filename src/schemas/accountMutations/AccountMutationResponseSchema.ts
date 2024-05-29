import { accountMutationsTable } from '@/db/schema/accountMutations';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const AccountMutationResponseSchema = createSelectSchema(accountMutationsTable).openapi('AccountMutationResponse');

export type AccountMutationResponse = z.infer<typeof AccountMutationResponseSchema>