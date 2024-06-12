import { z } from 'zod';
import { AccountSchema } from './AccountSchema';
import { messages } from '@/constatnts/messages';

export const AccountDetailSchema = z.object({
  code: z.number().openapi({
    example: 200,
  }),
  messages: z.string().openapi({
    example: messages.successDetail('akun'),
  }),
  data: AccountSchema,
})