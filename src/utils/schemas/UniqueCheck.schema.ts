import { z } from '@hono/zod-openapi';
import { StringSchema } from './String.schema';

export const UniqueCheckSchema = z.object({
  unique: new StringSchema('Unique').getSchema(),
  selectedId: new StringSchema('Selected ID').numeric({ min: 1, subset: 'natural' }).getSchema().optional()
}).openapi('UniqueCheck')

export type UniqueCheck = z.infer<typeof UniqueCheckSchema>