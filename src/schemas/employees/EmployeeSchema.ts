import { employeesTable } from 'db/schema/employees';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { Account, AccountSchema } from '../accounts/AccountSchema';

export const EmployeeSchema = createSelectSchema(employeesTable)
  .pick({
    id: true,
    name: true,
    phone: true,
  })

export type Employee = z.infer<typeof EmployeeSchema>