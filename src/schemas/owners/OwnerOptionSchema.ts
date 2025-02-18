import { MESSAGES } from '@/lib/constants/MESSAGES';
import { z } from 'zod';
import { OptionSchema } from '../OptionSchema';

export const OwnerOptionSchema = z.object({
  code: z.number().openapi({
    example: 200,
  }),
  messages: z.string().openapi({
    example: MESSAGES.successList('opsi pemilik'),
  }),
  data: z.array(OptionSchema),
})