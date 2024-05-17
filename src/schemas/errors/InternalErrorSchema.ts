import { z } from '@hono/zod-openapi'

export const InternalErrorSchema = z.object({
  code: z.number().openapi({
    example: 500,
  }),
  messages: z.string().array().openapi({
    example: ['Terjadi kesalahan server.'],
  }),
})