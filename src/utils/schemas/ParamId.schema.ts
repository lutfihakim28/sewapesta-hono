import { z } from '@hono/zod-openapi'
import { StringSchema } from './String.schema'
import { ObjectSchema } from './Object.schema'
import { SchemaType } from '../types/Schema.type'

export const ParamIdSchema = new ObjectSchema({
  id: new StringSchema('id').numeric({ min: 1, subset: 'integer' })
    .getSchema()
    .openapi({
      param: {
        name: 'id',
        in: 'path',
      },
      example: '1',
    }),
}).getSchema().openapi('ParamId')

export type ParamId = SchemaType<typeof ParamIdSchema>