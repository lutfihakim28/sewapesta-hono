import { z } from 'zod';
import { AccountSchema } from './AccountSchema';
import { messages } from '@/constatnts/messages';

export const AccountListSchema = z.object({
  code: z.number().openapi({
    example: 200,
  }),
  messages: z.string().openapi({
    example: messages.successList('akun'),
  }),
  data: z.array(AccountSchema),
  meta: z.object({
    page: z.number().positive().openapi({ example: 1 }),
    limit: z.number().positive().openapi({ example: 10 }),
    totalPage: z.number().positive().openapi({ example: 15 }),
  }),
})