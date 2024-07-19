import { messages } from '@/constatnts/messages';
import { z } from 'zod';
import { AccountMutationSchema } from './AccountMutationSchema';

export const AccountMutationListSchema = z.object({
  code: z.number().openapi({
    example: 200,
  }),
  messages: z.string().openapi({
    example: messages.successList('mutasi akun'),
  }),
  data: z.array(AccountMutationSchema),
  meta: z.object({
    page: z.number().positive().openapi({ example: 1 }),
    pageSize: z.number().positive().openapi({ example: 10 }),
    pageCount: z.number().positive().openapi({ example: 15 }),
  }),
})