import { messages } from '@/constatnts/messages';
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
    example: messages.successList('products'),
  }),
  data: z.array(ItemProductSchema),
})