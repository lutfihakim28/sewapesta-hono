import { z } from '@hono/zod-openapi'

export const ParamIdSchema = z.object({
  id: z
    .string()
    .openapi({
      param: {
        name: 'id',
        in: 'path',
      },
      example: '1',
    }),
}).openapi('ParamId')

export type ParamId = z.infer<typeof ParamIdSchema>