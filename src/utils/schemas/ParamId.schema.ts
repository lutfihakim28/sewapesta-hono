import { z } from '@hono/zod-openapi'
import { StringSchema } from './String.schema'

export const ParamIdSchema = z.object({
  id: new StringSchema('id').numeric({ min: 1, subset: 'integer' })
    .getSchema()
    .openapi({
      param: {
        name: 'id',
        in: 'path',
      },
      example: '1',
    }),
}).openapi('ParamId')

export type ParamId = z.infer<typeof ParamIdSchema>