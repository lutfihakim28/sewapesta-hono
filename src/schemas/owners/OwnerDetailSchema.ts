import { MESSAGES } from '@/lib/constants/MESSAGES';
import { z } from 'zod';
import { OwnerSchema } from './OwnerSchema';

export const OwnerDetailSchema = z.object({
  code: z.number().openapi({
    example: 200,
  }),
  messages: z.string().openapi({
    example: MESSAGES.successDetail('pemilik'),
  }),
  data: OwnerSchema,
})