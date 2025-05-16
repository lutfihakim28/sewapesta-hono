import { z } from '@hono/zod-openapi';
import { StringSchema } from './String.schema';

export const DateRangeSchema = z.object({
  from: new StringSchema('From').numeric({ min: 0 })
    .optional()
    .openapi({
      description: 'Unix timestamp in seconds.',
    }),
  to: new StringSchema('To').numeric({ min: 0 })
    .optional()
    .openapi({
      description: 'Unix timestamp in seconds.',
    }),
}).openapi('DateRange')