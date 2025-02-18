import { MESSAGES } from '@/lib/constants/MESSAGES';
import { z } from 'zod';
import { OrderSchema } from './OrderSchema';

export const OrderDetailSchema = z.object({
  code: z.number().openapi({
    example: 200,
  }),
  messages: z.string().openapi({
    example: MESSAGES.successList('pesanan'),
  }),
  data: OrderSchema,
})