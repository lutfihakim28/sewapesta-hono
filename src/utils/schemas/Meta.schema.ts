import { z } from '@hono/zod-openapi';
import { NumberSchema } from './Number.schema';

export const MetaSchema = z.object({
  page: new NumberSchema('Page').natural().getSchema().openapi({ example: 1 }),
  pageSize: new NumberSchema('Page size').natural().getSchema().openapi({ example: 10 }),
  pageCount: new NumberSchema('Page count').whole().getSchema().openapi({ example: 15 }),
  totalData: new NumberSchema('Total data').whole().getSchema().openapi({ example: 150 }),
}).openapi('ResponseMeta')