import { z } from '@hono/zod-openapi'

export const ParamIdSchema = z.object({
  id: z
    .string()
    .openapi({
      param: {
        name: 'id',
        in: 'path',
      },
      example: '28',
    }),
}).openapi('ParamId')

export type ParamId = z.infer<typeof ParamIdSchema>