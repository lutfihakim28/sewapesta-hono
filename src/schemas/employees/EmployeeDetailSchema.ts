import { messages } from '@/constants/Message';
import { z } from 'zod';
import { EmployeeSchema } from './EmployeeSchema';

export const EmployeeDetailSchema = z.object({
  code: z.number().openapi({
    example: 200,
  }),
  messages: z.string().openapi({
    example: messages.successDetail('karyawan'),
  }),
  data: EmployeeSchema,
})