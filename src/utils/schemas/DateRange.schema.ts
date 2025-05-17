import { StringSchema } from './String.schema';
import { ObjectSchema } from './Object.schema';

export const DateRangeSchema = new ObjectSchema({
  from: new StringSchema('From').numeric({ min: 0, subset: 'whole' })
    .getSchema()
    .optional()
    .openapi({
      description: 'Unix timestamp in seconds.',
    }),
  to: new StringSchema('To').numeric({ min: 0, subset: 'whole' })
    .getSchema()
    .optional()
    .openapi({
      description: 'Unix timestamp in seconds.',
    }),
}).getSchema().openapi('DateRange')