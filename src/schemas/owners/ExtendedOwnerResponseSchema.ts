import { z } from 'zod';
import { OwnerResponseSchema } from './OwnerResponseSchema';
import { AccountResponseSchema } from '../accounts/AccountResponseSchema';

export const ExtendedOwnerResponseSchema = OwnerResponseSchema.merge(z.object({
  account: AccountResponseSchema,
})).openapi('ExtendedOwnerResponse')

export type ExtendedOwnerResponse = z.infer<typeof ExtendedOwnerResponseSchema>