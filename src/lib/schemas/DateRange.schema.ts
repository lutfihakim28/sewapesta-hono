import { z } from '@hono/zod-openapi';
import { NumericSchema } from './Numeric.schema';

export const DateRangeSchema = z.object({
  from: NumericSchema('Start at', 0)
    .openapi({
      description: 'Unix timestamp in seconds.',
    }),
  to: NumericSchema('Start at', 0)
    .openapi({
      description: 'Unix timestamp in seconds.',
    }),
}).partial().openapi('DateRange')