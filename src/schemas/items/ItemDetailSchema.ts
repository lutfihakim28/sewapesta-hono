import { MESSAGES } from '@/lib/constants/MESSAGES';
import { z } from 'zod';
import { ItemSchema } from './ItemSchema';

export const ItemDetailSchema = z.object({
  code: z.number().openapi({
    example: 200,
  }),
  messages: z.string().openapi({
    example: MESSAGES.successDetail('barang'),
  }),
  data: ItemSchema,
})