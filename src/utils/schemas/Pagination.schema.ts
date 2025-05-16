import { z } from '@hono/zod-openapi';
import { StringSchema } from './String.schema';

export const PaginationSchema = z.object({
  page: new StringSchema('Product ID').numeric({ min: 1 }).optional().openapi({ example: '1' }),
  pageSize: new StringSchema('Product ID').numeric({ min: 5 }).optional().openapi({ example: '10' }),
}).openapi('Pagination')