import { z } from '@hono/zod-openapi'

export function ResponseSchema<T>(code: number, message: string, dataSchema?: z.ZodType<T>, paginated?: boolean) {
  return z.object({
    code: z.number().openapi({
      example: code,
    }),
    messages: z.string().array().openapi({
      example: [message],
    }),
    data: dataSchema || z.undefined().openapi({
      type: 'null'
    }),
    meta: paginated ? z.object({
      page: z.number().positive(),
      limit: z.number().positive(),
      totalPage: z.number().positive(),
    }).optional() : z.undefined().openapi({
      type: 'null'
    }),
  }).openapi('Response')
}