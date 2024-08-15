import { employees } from 'db/schema/employees';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const EmployeeSchema = createSelectSchema(employees)
  .pick({
    id: true,
    name: true,
    phone: true,
  })

export type Employee = z.infer<typeof EmployeeSchema>