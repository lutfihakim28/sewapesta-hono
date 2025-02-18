import { MESSAGES } from '@/lib/constants/MESSAGES';
import { z } from 'zod';

export const UnauthorizedSchema = z.object({
  code: z.number().openapi({
    example: 401,
  }),
  messages: z.string().openapi({
    example: MESSAGES.unauthorized,
  })
}).openapi('Unauthorized')