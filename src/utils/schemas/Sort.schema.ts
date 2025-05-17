import { z } from '@hono/zod-openapi';
import { ObjectSchema } from './Object.schema';
import { StringSchema } from './String.schema';
import { ArraySchema } from './Array.schema';

export function SortSchema<T extends string>(columns: T[]) {
  return new ObjectSchema({
    asc: new ArraySchema('asc', new StringSchema('asc').getSchema()).getSchema()
      .optional()
      .transform((val) => !val ? [] : val)
      .openapi({ description: `Allowed columns are ${columns.join(', ')}`, example: [columns[0], columns[2]] }),
    desc: new ArraySchema('asc', new StringSchema('asc').getSchema()).getSchema()
      .optional()
      .transform((val) => !val ? [] : val)
      .openapi({ description: `Allowed columns are ${columns.join(', ')}`, example: [columns[1]] }),
  })
    .getSchema()
    .openapi('Sort')
}