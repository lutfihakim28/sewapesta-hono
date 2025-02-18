import { MESSAGES } from '@/lib/constants/MESSAGES';
import { z } from 'zod';
import { OwnerSchema } from './OwnerSchema';

export const OwnerListSchema = z.object({
  code: z.number().openapi({
    example: 200,
  }),
  messages: z.string().openapi({
    example: MESSAGES.successList('pemilik'),
  }),
  data: z.array(OwnerSchema),
  meta: z.object({
    page: z.number().positive().openapi({ example: 1 }),
    pageSize: z.number().positive().openapi({ example: 10 }),
    pageCount: z.number().positive().openapi({ example: 15 }),
  }),
})