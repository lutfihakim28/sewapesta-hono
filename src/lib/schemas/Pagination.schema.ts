import { z } from 'zod';

export const PaginationSchema = z.object({
  page: z.string().optional().openapi({ example: '1' }),
  pageSize: z.string().optional().openapi({ example: '10' }),
}).openapi('Pagination')