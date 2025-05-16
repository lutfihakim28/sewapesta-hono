import { z } from '@hono/zod-openapi';
import { StringSchema } from './String.schema';

export const UniqueCheckSchema = z.object({
  unique: new StringSchema('Unique').schema,
  selectedId: new StringSchema('Selected ID').numeric({ min: 1 }).optional()
}).openapi('UniqueCheck')

export type UniqueCheck = z.infer<typeof UniqueCheckSchema>