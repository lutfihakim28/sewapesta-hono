import { messages } from '@/lib/constants/messages';
import { z } from 'zod';
import { OptionSchema } from '../OptionSchema';

export const OwnerOptionSchema = z.object({
  code: z.number().openapi({
    example: 200,
  }),
  messages: z.string().openapi({
    example: messages.successList('opsi pemilik'),
  }),
  data: z.array(OptionSchema),
})