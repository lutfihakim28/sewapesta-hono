import { z } from '@hono/zod-openapi';

export const MetaSchema = z.object({
  page: z.number().positive().openapi({ example: 1 }),
  pageSize: z.number().positive().openapi({ example: 10 }),
  pageCount: z.number().positive().openapi({ example: 15 }),
  totalData: z.number().positive().openapi({ example: 150 }),
}).openapi('ResponseMeta')