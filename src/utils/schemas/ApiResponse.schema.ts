import { z } from '@hono/zod-openapi';
import { MetaSchema } from './Meta.schema';
import { StringSchema } from './String.schema';
import { NumberSchema } from './Number.schema';
import { ObjectSchema } from './Object.schema';
import { ArraySchema } from './Array.schema';

export function ApiResponseSchema(message: string, code: number = 200) {
  return new ObjectSchema({
    code: new NumberSchema('Code').natural().getSchema().openapi({
      example: code,
    }),
    messages: new ArraySchema('Messages', new StringSchema('Message').getSchema()).getSchema().openapi({ example: [message] })
  }).getSchema()
}

export function ApiResponseDataSchema<T extends z.ZodTypeAny>(schema: T, message: string) {
  return ApiResponseSchema(message).extend({
    data: schema,
  })
}

export function ApiResponseListSchema<T extends z.ZodTypeAny>(schema: T, message: string) {
  return ApiResponseSchema(message).extend({
    data: schema,
    meta: MetaSchema,
  })
}