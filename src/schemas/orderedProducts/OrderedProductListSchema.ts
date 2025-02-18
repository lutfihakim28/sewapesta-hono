import { MESSAGES } from '@/lib/constants/MESSAGES';
import { z } from 'zod';
import { OrderedProductSchema } from './OrderedProductSchema';

export const OrderedProductListSchema = z.object({
  code: z.number().openapi({
    example: 200,
  }),
  messages: z.string().openapi({
    example: MESSAGES.successList('produk yang dipesan'),
  }),
  data: z.array(OrderedProductSchema),
})