import { employeesTable } from '@/db/schema/employees';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const EmployeeResponseSchema = createSelectSchema(employeesTable).openapi('EmployeeResponse')

export type EmployeeResponse = z.infer<typeof EmployeeResponseSchema>