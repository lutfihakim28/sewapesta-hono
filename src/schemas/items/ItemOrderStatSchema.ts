import { messages } from '@/constants/Message';
import { z } from 'zod';

export const ItemOrderStatSchema = z.object({
  order: z.number(),
  quantity: z.number(),
  month: z.string(),
})

export type ItemOrderStat = z.infer<typeof ItemOrderStatSchema>

export const ListItemOrderStatSchema = z.object({
  code: z.number().openapi({
    example: 200,
  }),
  messages: z.string().openapi({
    example: messages.successList('statistik pesanan'),
  }),
  data: z.array(ItemOrderStatSchema),
})