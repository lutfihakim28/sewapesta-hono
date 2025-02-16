import { messages } from '@/constants/message';
import { z } from 'zod';
import { ItemSchema } from './ItemSchema';

export const ItemListSchema = z.object({
  code: z.number().openapi({
    example: 200,
  }),
  messages: z.string().openapi({
    example: messages.successList('barang'),
  }),
  data: z.array(ItemSchema),
  meta: z.object({
    page: z.number().positive().openapi({ example: 1 }),
    pageSize: z.number().positive().openapi({ example: 10 }),
    pageCount: z.number().positive().openapi({ example: 15 }),
  }),
})