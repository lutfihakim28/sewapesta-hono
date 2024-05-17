import { z } from '@hono/zod-openapi'

export const UnauthorizedErrorSchema = z.object({
  code: z.number().openapi({
    example: 401,
  }),
  messages: z.string().array().openapi({
    example: ['Token tidak valid.'],
  }),
})