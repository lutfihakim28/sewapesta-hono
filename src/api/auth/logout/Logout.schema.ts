import { messages } from '@/lib/constants/messages';
import { z } from 'zod';

export const LogoutResponseSchema = z.object({
  messages: z
    .string()
    .array()
    .default([messages.successLogout])
    .openapi({
      example: [messages.successLogout]
    }),
}).openapi('LogoutResponse');