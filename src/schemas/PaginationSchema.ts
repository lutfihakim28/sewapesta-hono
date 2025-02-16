import { z } from 'zod';

export const PaginationSchema = z.object({
  page: z.number().positive().openapi({ example: 1 }),
  pageSize: z.number().positive().openapi({ example: 10 }),
}).partial().openapi('Pagination')