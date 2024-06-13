import { employeesTable } from '@/db/schema/employees';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { Account, AccountSchema } from '../accounts/AccountSchema';

export const _EmployeeSchema = createSelectSchema(employeesTable)
  .pick({
    id: true,
    name: true,
    phone: true,
  })

export type Employee = z.infer<typeof _EmployeeSchema> & {
  account: Account | null;
}

export const EmployeeSchema: z.ZodType<Employee> = _EmployeeSchema.extend({
  account: AccountSchema.nullable()
}).openapi('Employee');