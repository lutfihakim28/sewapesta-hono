import { z } from 'zod';
import { MetaSchema } from './Meta.schema';

export function ApiResponseSchema(message: string) {
  return z.object({
    code: z.number().openapi({
      example: 200,
    }),
    messages: z.union([
      z.string().openapi({
        example: message,
      }),
      z.array(z.string().openapi({
        example: message,
      })),
    ]),
  })
}

export function ApiResponseDataSchema<T extends z.ZodTypeAny>(schema: T, message: string) {
  return z.object({
    code: z.number().openapi({
      example: 200,
    }),
    messages: z.union([
      z.string().openapi({
        example: message,
      }),
      z.array(z.string().openapi({
        example: message,
      })),
    ]),
    data: schema,
  })
}

export function ApiResponseListSchema<T extends z.ZodTypeAny>(schema: T, message: string) {
  return z.object({
    code: z.number().openapi({
      example: 200,
    }),
    messages: z.union([
      z.string().openapi({
        example: message,
      }),
      z.array(z.string().openapi({
        example: message,
      })),
    ]),
    data: schema,
    meta: MetaSchema,
  })
}