import { z } from '@hono/zod-openapi';
import { ObjectSchema } from './Object.schema';
import { StringSchema } from './String.schema';

export function SortSchema<T extends string>(columns: T[]) {
  return new ObjectSchema({
    asc: z.array(new StringSchema('asc').getSchema())
      .optional()
      .transform((val) => !val ? [] : val)
      .openapi({ description: `Allowed columns are ${columns.join(', ')}`, example: [columns[0], columns[2]] }),
    desc: z.array(new StringSchema('asc').getSchema())
      .optional()
      .transform((val) => !val ? [] : val)
      .openapi({ description: `Allowed columns are ${columns.join(', ')}`, example: [columns[1]] }),
  })
    .getSchema()
    .openapi('Sort')
}