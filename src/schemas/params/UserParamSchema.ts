import { z } from '@hono/zod-openapi'

export const UserParamSchema = z.object({
  id: z
    .string()
    .min(3, 'parameter id minimal 3 digit')
    .openapi({
      param: {
        name: 'id',
        in: 'path',
      },
      example: '1212121',
    }),
})