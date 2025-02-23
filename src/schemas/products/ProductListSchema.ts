import { messages } from '@/lib/constants/messages';
import { z } from 'zod';
import { ProductSchema } from './ProductSchema';

export const ProductListSchema = z.object({
  code: z.number().openapi({
    example: 200,
  }),
  messages: z.string().openapi({
    example: messages.successList('pemilik'),
  }),
  data: z.array(ProductSchema),
  meta: z.object({
    page: z.number().positive().openapi({ example: 1 }),
    pageSize: z.number().positive().openapi({ example: 10 }),
    pageCount: z.number().positive().openapi({ example: 15 }),
  }),
})