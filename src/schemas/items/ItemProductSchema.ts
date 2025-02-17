import { MESSAGES } from '@/lib/constants/MESSAGES';
import { z } from 'zod';

export const ItemProductSchema = z.object({
  id: z.number().nullable(),
  name: z.string().nullable(),
  price: z.number(),
})

export type ItemProduct = z.infer<typeof ItemProductSchema>

export const ListItemProductSchema = z.object({
  code: z.number().openapi({
    example: 200,
  }),
  messages: z.string().openapi({
    example: MESSAGES.successList('products'),
  }),
  data: z.array(ItemProductSchema),
})