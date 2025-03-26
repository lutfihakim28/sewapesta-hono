import { z } from '@hono/zod-openapi';
import { SortEnum } from '../enums/SortEnum';

export function SortSchema<T extends string>(columns: [T, ...T[]]) {
  return z.object({
    sort: z.nativeEnum(SortEnum).default(SortEnum.Ascending),
    sortBy: z.enum(columns, {
      message: 'Column not found',
    }),
  }).partial().openapi('Sort')
}