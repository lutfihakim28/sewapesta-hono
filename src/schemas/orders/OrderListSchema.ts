import { MESSAGES } from '@/lib/constants/MESSAGES';
import { z } from 'zod';
import { OrderSchema } from './OrderSchema';

export const OrderListSchema = z.object({
  code: z.number().openapi({
    example: 200,
  }),
  messages: z.string().openapi({
    example: MESSAGES.successList('pesanan'),
  }),
  data: z.array(OrderSchema),
  meta: z.object({
    page: z.number().positive().openapi({ example: 1 }),
    pageSize: z.number().positive().openapi({ example: 10 }),
    pageCount: z.number().positive().openapi({ example: 15 }),
  }),
})