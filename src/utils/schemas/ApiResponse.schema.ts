import { z } from '@hono/zod-openapi';
import { MetaSchema } from './Meta.schema';
import { StringSchema } from './String.schema';
import { NumberSchema } from './Number.schema';

export function ApiResponseSchema(message: string, code: number = 200) {
  return z.object({
    code: new NumberSchema('Code').natural().getSchema().openapi({
      example: code,
    }),
    messages: z.array(new StringSchema('Message').getSchema()).openapi({ example: [message] })
  })
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