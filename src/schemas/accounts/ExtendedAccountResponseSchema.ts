import { z } from 'zod';
import { AccountResponseSchema } from './AccountResponseSchema';
import { UserResponseSchema } from '../UserSchema';
import { EmployeeResponseSchema } from '../employees/EmployeeResponseSchema';
import { OwnerResponseSchema } from '../owners/OwnerResponseSchema';
import { AccountMutationResponseSchema } from '../accountMutations/AccountMutationResponseSchema';

export const ExtendedAccountResponseSchema = AccountResponseSchema.merge(z.object({
  user: z.nullable(UserResponseSchema),
  employee: z.nullable(EmployeeResponseSchema),
  owner: z.nullable(OwnerResponseSchema),
  mutations: z.array(AccountMutationResponseSchema),
})).openapi('ExtendedAccountResponse')

export type ExtendedAccountResponse = z.infer<typeof ExtendedAccountResponseSchema>