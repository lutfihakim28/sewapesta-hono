import { z } from 'zod';
import { AccountResponseSchema } from './AccountResponseSchema';
import { UserResponseSchema } from '../UserSchema';
import { EmployeeResponseSchema } from '../employees/EmployeeResponseSchema';
import { OwnerResponseSchema } from '../owners/OwnerResponseSchema';

export const ExtendedAccountResponseSchema = AccountResponseSchema.merge(z.object({
  user: z.nullable(UserResponseSchema),
  employee: z.nullable(EmployeeResponseSchema),
  owner: z.nullable(OwnerResponseSchema),
  // TODO: account mutations
})).openapi('ExtendedAccountResponse')

export type ExtendedAccountResponse = z.infer<typeof ExtendedAccountResponseSchema>