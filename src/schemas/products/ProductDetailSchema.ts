import { messages } from '@/constatnts/messages';
import { z } from 'zod';
import { ProductSchema } from './ProductSchema';

export const ProductDetailSchema = z.object({
  code: z.number().openapi({
    example: 200,
  }),
  messages: z.string().openapi({
    example: messages.successList('pemilik'),
  }),
  data: ProductSchema,
})