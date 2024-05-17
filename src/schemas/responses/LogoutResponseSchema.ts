import { z } from 'zod';

export const LogoutResponseSchema = z.object({
  messages: z.string().array().default(['Berhasil keluar']).openapi({
    example: ['Berhasil keluar']
  }),
})