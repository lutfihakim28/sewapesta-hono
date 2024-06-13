import { z } from '@hono/zod-openapi'

export const UserSchema = z
  .object({
    id: z.number().openapi({
      example: 1,
    }),
    username: z.string().openapi({
      example: 'superadmin',
    }),
  })
  .pick({
    username: true,
    id: true,
  })
  .openapi('User');