import { messages } from '@/constants/Message';
import { z } from 'zod';

export const UnauthorizedSchema = z.object({
  code: z.number().openapi({
    example: 401,
  }),
  messages: z.string().openapi({
    example: messages.unauthorized,
  })
}).openapi('Unauthorized')