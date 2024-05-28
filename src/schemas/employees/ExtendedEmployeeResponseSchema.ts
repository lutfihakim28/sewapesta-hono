import { z } from 'zod';
import { EmployeeResponseSchema } from './EmployeeResponseSchema';
import { AccountResponseSchema } from '../accounts/AccountResponseSchema';

export const ExtendedEmployeeResponseSchema = EmployeeResponseSchema.merge(z.object({
  account: AccountResponseSchema,
})).openapi('ExtendedEmployeeResponse')

export type ExtendedEmployeeResponse = z.infer<typeof ExtendedEmployeeResponseSchema>