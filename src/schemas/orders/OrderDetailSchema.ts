import { messages } from '@/constatnts/messages';
import { z } from 'zod';
import { OrderSchema } from './OrderSchema';

export const OrderDetailSchema = z.object({
  code: z.number().openapi({
    example: 200,
  }),
  messages: z.string().openapi({
    example: messages.successList('pesanan'),
  }),
  data: OrderSchema,
})