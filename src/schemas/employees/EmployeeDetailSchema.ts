import { MESSAGES } from '@/lib/constants/MESSAGES';
import { z } from 'zod';
import { EmployeeSchema } from './EmployeeSchema';

export const EmployeeDetailSchema = z.object({
  code: z.number().openapi({
    example: 200,
  }),
  messages: z.string().openapi({
    example: MESSAGES.successDetail('karyawan'),
  }),
  data: EmployeeSchema,
})