import { messages } from '@/constatnts/messages';
import { z } from 'zod';
import { ItemSchema } from './ItemSchema';

export const ItemDetailSchema = z.object({
  code: z.number().openapi({
    example: 200,
  }),
  messages: z.string().openapi({
    example: messages.successDetail('barang'),
  }),
  data: ItemSchema,
})