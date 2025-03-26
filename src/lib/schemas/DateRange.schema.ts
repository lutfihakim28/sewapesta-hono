import { z } from '@hono/zod-openapi';

export const DateRangeSchema = z.object({
  startAt: z
    .string()
    .date()
    .openapi({
      description: 'YYYY-MM-DD',
    }),
  endAt: z
    .string()
    .date()
    .openapi({
      description: 'YYYY-MM-DD',
    }),
}).partial().openapi('DateRange')