import { messages } from '@/constants/message';
import { z } from 'zod';

export const ServerErrorSchema = z.object({
  code: z.number().openapi({
    example: 500,
  }),
  messages: z.string().openapi({
    example: messages.errorServer,
  })
}).openapi('ServerError')