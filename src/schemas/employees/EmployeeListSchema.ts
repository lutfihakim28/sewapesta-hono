import { messages } from '@/constants/Message';
import { z } from 'zod';
import { EmployeeSchema } from './EmployeeSchema';

export const EmployeeListSchema = z.object({
  code: z.number().openapi({
    example: 200,
  }),
  messages: z.string().openapi({
    example: messages.successList('karyawan'),
  }),
  data: z.array(EmployeeSchema),
  meta: z.object({
    page: z.number().positive().openapi({ example: 1 }),
    pageSize: z.number().positive().openapi({ example: 10 }),
    pageCount: z.number().positive().openapi({ example: 15 }),
  }),
})