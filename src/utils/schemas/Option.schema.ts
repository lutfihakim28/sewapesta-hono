import { z } from '@hono/zod-openapi';
import { StringSchema } from './String.schema';

export const OptionSchema = z.object({
  value: z.union([new StringSchema('Message').schema, z.number()]),
  label: new StringSchema('Message').schema,
}).openapi('Option')

export const OptionQuerySchema = z.object({
  keyword: new StringSchema('Message').schema.optional()
}).openapi('OptionQuery')

export type Option = z.infer<typeof OptionSchema>
export type OptionQuery = z.infer<typeof OptionQuerySchema>