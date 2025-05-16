import { z } from '@hono/zod-openapi';
import { StringSchema } from './String.schema';

export const SearchSchema = z.object({
  keyword: new StringSchema('Message').min(3).optional().schema,
}).openapi('Search')