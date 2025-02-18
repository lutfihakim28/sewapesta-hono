import { z } from 'zod';

export function ResponseSchema<T extends z.ZodTypeAny>(schema: T, message: string) {
  return z.object({
    code: z.number().openapi({
      example: 200,
    }),
    messages: z.string().openapi({
      example: message,
    }),
    data: schema,
  })
}