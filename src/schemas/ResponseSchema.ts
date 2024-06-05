import { z } from '@hono/zod-openapi'

export function ResponseSchema<T>(code: number, message: string, dataSchema?: z.ZodType<T>, pagination?: boolean) {
  if (!!dataSchema && !pagination) {
    return z.object({
      code: z.number().openapi({
        example: code,
      }),
      messages: z.string().array().openapi({
        example: [message],
      }),
      data: dataSchema,
    })
  }

  if (!!dataSchema && !!pagination) {
    return z.object({
      code: z.number().openapi({
        example: code,
      }),
      messages: z.string().array().openapi({
        example: [message],
      }),
      data: dataSchema,
      meta: z.object({
        page: z.number().positive(),
        limit: z.number().positive(),
        totalPage: z.number().positive(),
      })
    })
  }

  return z.object({
    code: z.number().openapi({
      example: code,
    }),
    messages: z.string().array().openapi({
      example: [message],
    }),
  })
}