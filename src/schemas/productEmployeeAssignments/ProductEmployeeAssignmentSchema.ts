import { productEmployeeAssignments } from 'db/schema/productEmployeeAssignments';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { Employee, EmployeeSchema } from '../employees/EmployeeSchema';

const _ProductEmployeeAssignmentSchema = createSelectSchema(productEmployeeAssignments).pick({
  id: true,
})

export type ProductEmployeeAssignment = z.infer<typeof _ProductEmployeeAssignmentSchema> & {
  employee: Employee
}

export const ProductEmployeeAssignmentSchema: z.ZodType<ProductEmployeeAssignment> = _ProductEmployeeAssignmentSchema.extend({
  employee: EmployeeSchema
})