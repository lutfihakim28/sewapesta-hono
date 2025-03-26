import { z } from '@hono/zod-openapi';
import { MetaSchema } from './Meta.schema';

export function ApiResponseSchema(message: string, code: number = 200) {
  return z.object({
    code: z.number().openapi({
      example: code,
    }),
    messages: z.array(z.string()).openapi({ example: [message] })
  })
}

export function ApiResponseDataSchema<T extends z.ZodTypeAny>(schema: T, message: string) {
  return ApiResponseSchema(message).extend({
    data: schema,
  })
}

export function ApiResponseListSchema<T extends z.ZodTypeAny>(schema: T, message: string) {
  return ApiResponseSchema(message).extend({
    meta: MetaSchema,
  })
}