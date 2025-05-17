import { z } from '@hono/zod-openapi';
import { StringSchema } from './String.schema';
import { NumberSchema } from './Number.schema';

export const OptionSchema = z.object({
  value: z.union([new StringSchema('Value').getSchema(), new NumberSchema('Value').natural().getSchema()]),
  label: new StringSchema('Message').getSchema(),
}).openapi('Option')

export const OptionQuerySchema = z.object({
  keyword: new StringSchema('Keyword').getSchema().optional()
}).openapi('OptionQuery')

export type Option = z.infer<typeof OptionSchema>
export type OptionQuery = z.infer<typeof OptionQuerySchema>