import { z } from 'zod';

export const SearchSchema = z.object({
  keyword: z.string().min(3).optional().openapi({ example: '' }),
}).openapi('Search')