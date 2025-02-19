import { MESSAGES } from '@/lib/constants/MESSAGES';
import { z } from 'zod';

export const NotFoundSchema = z.object({
  code: z.number().openapi({
    example: 404,
  }),
  messages: z.string().openapi({
    example: MESSAGES.errorNotFound('Pesanan')
  })
}).openapi('NotFound')