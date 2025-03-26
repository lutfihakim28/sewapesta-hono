import { z } from '@hono/zod-openapi';

export const SearchSchema = z.object({
  keyword: z.string().min(3).optional(),
}).openapi('Search')