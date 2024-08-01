import { z } from 'zod';

export function SortSchema<T extends string>(columns: readonly [T, ...T[]]) {
  return z.object({
    sort: z.enum(['asc', 'desc']).default('desc'),
    sortBy: z.enum(columns, {
      message: 'Column not found',
    }),
  }).partial().openapi('Sort')
}