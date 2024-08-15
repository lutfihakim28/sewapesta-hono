import { z } from 'zod';

export const AssignedEmployeeSchema = z.object({
  id: z.number(),
  name: z.string(),
  phone: z.string(),
  products: z.array(z.object({
    id: z.number(),
    name: z.string(),
    code: z.string(),
  }))
})

export type AssignedEmployee = z.infer<typeof AssignedEmployeeSchema>