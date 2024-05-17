import { z } from '@hono/zod-openapi'

export const UserResponseSchema = z
  .object({
    id: z.number().openapi({
      example: 1,
    }),
    username: z.string().openapi({
      example: 'John Doe',
    }),
  })
  .openapi('User')