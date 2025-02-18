import { MESSAGES } from '@/lib/constants/MESSAGES';
import { z } from 'zod';
import { ProductSchema } from './ProductSchema';

export const ProductDetailSchema = z.object({
  code: z.number().openapi({
    example: 200,
  }),
  messages: z.string().openapi({
    example: MESSAGES.successList('pemilik'),
  }),
  data: ProductSchema,
})