import { messages } from '@/constants/message';
import { z } from 'zod';
import { AssignedEmployeeSchema } from './AssignedEmployeeSchema';

export const ProductEmployeeAssignmentListSchema = z.object({
  code: z.number().openapi({
    example: 200,
  }),
  messages: z.string().openapi({
    example: messages.successList('karyawan yang bertugas'),
  }),
  data: z.array(AssignedEmployeeSchema),
})