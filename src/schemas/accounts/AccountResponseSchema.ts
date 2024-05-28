import { accountsTable } from '@/db/schema/accounts';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const AccountResponseSchema = createSelectSchema(accountsTable).openapi('AccountResponse');

export type AccountResponse = z.infer<typeof AccountResponseSchema>