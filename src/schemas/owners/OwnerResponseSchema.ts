import { ownersTable } from '@/db/schema/owners';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const OwnerResponseSchema = createSelectSchema(ownersTable).openapi('OwnerResponse')

export type OwnerResponse = z.infer<typeof OwnerResponseSchema>