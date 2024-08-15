import { messages } from '@/constatnts/messages';
import { z } from 'zod';
import { OrderedProductSchema } from './OrderedProductSchema';

export const OrderedProductListSchema = z.object({
  code: z.number().openapi({
    example: 200,
  }),
  messages: z.string().openapi({
    example: messages.successList('produk yang dipesan'),
  }),
  data: z.array(OrderedProductSchema),
})