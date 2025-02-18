import { z } from 'zod';

export const PaginationSchema = z.object({
  page: z.string().openapi({ example: '1' }),
  pageSize: z.string().openapi({ example: '10' }),
}).partial().openapi('Pagination')