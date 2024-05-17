import { z } from '@hono/zod-openapi'

export const ValidationErrorSchema = z.object({
  code: z.number().openapi({
    example: 422,
  }),
  messages: z.string().array().openapi({
    example: ['Nama pengguna harus diisi.'],
  }),
})