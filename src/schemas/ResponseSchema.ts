import { z } from 'zod';
import { PaginationSchema } from './PaginationSchema';

export function ResponseSchema<T extends z.ZodTypeAny>(schema: T, message: string, meta?: boolean) {
  const responseSchema = z.object({
    code: z.number().openapi({
      example: 200,
    }),
    messages: z.string().openapi({
      example: message,
    }),
    data: schema,
  })
  if (meta) {
    responseSchema.extend({
      meta: PaginationSchema.extend({
        pageCount: z.number().positive().openapi({ example: 15 }),
      }),
    })
  }
  return responseSchema
}