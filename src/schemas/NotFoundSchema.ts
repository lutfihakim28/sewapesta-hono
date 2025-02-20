import { messages } from '@/lib/constants/messages';
import { z } from 'zod';

export const NotFoundSchema = z.object({
  code: z.number().openapi({
    example: 404,
  }),
  messages: z.string().openapi({
    example: messages.errorNotFound('Pesanan')
  })
}).openapi('NotFound')