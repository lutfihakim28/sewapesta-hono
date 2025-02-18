import { MESSAGES } from '@/lib/constants/MESSAGES';
import { z } from 'zod';
import { StockMutationSchema } from './StockMutationSchema';

export const StockMutationListSchema = z.object({
  code: z.number().openapi({
    example: 200,
  }),
  messages: z.string().openapi({
    example: MESSAGES.successList('mutasi stok'),
  }),
  data: z.array(StockMutationSchema),
})