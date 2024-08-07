import { z } from 'zod';

export const PaginationSchema = z.object({
  page: z
    .string()
    .optional()
    .default('1')
    .openapi({ example: '1' }),
  pageSize: z
    .string()
    .optional()
    .default('10')
    .openapi({ example: '10' }),
}).partial().openapi('Pagination')