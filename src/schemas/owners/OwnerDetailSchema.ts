import { messages } from '@/constatnts/messages';
import { z } from 'zod';
import { OwnerSchema } from './OwnerSchema';

export const OwnerDetailSchema = z.object({
  code: z.number().openapi({
    example: 200,
  }),
  messages: z.string().openapi({
    example: messages.successDetail('pemilik'),
  }),
  data: OwnerSchema,
})