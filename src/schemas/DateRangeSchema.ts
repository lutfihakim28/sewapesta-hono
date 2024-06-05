import { z } from 'zod';

export const DateRangeSchema = z.object({
  startAt: z.string().date().openapi({
    example: '2022-01-01',
  }),
  endAt: z.string().date().openapi({
    example: '2022-01-31',
  }),
}).partial().openapi('DateRangeSchema')