import { z } from '@hono/zod-openapi';

export const OptionSchema = z.object({
  value: z.union([z.string(), z.number()]),
  label: z.string(),
}).openapi('Option')

export const OptionQuerySchema = z.object({
  keyword: z.string().optional()
}).openapi('OptionQuery')

export type Option = z.infer<typeof OptionSchema>
export type OptionQuery = z.infer<typeof OptionQuerySchema>