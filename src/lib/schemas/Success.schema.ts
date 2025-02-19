import { MESSAGES } from '@/lib/constants/MESSAGES';
import { z } from 'zod';

export const SuccessSchema = z.object({
  code: z.number().openapi({
    example: 200
  }),
  messages: z.string().openapi({
    example: MESSAGES.successCreate('data'),
  })
}).openapi('Success')