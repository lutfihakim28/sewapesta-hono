import { messages } from '@/lib/constants/messages';
import { z } from 'zod';

export const SuccessSchema = z.object({
  code: z.number().openapi({
    example: 200
  }),
  messages: z.string().openapi({
    example: messages.successCreate('data'),
  })
}).openapi('Success')