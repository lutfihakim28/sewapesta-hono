import { MESSAGES } from '@/lib/constants/MESSAGES';
import { z } from 'zod';

export const ServerErrorSchema = z.object({
  code: z.number().openapi({
    example: 500,
  }),
  messages: z.string().openapi({
    example: MESSAGES.errorServer,
  })
}).openapi('ServerError')