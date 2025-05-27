import { ObjectSchema } from './Object.schema';
import { StringSchema } from './String.schema';
import { ArraySchema } from './Array.schema';
import { UnionSchema } from './Union.schema';

export function SortSchema<T extends string>(columns: T[]) {
  return new ObjectSchema({
    asc: new UnionSchema([new ArraySchema('asc', new StringSchema('asc').getSchema()).getSchema()
      .optional()
      .transform((val) => !val ? [] : val), new StringSchema('asc').getSchema()])
      .getSchema()
      .openapi({ description: `Allowed columns are ${columns.join(', ')}`, example: [columns[0], columns[2]] }),
    desc: new UnionSchema([new ArraySchema('desc', new StringSchema('desc').getSchema()).getSchema()
      .optional()
      .transform((val) => !val ? [] : val), new StringSchema('desc').getSchema()])
      .getSchema()
      .openapi({ description: `Allowed columns are ${columns.join(', ')}`, example: [columns[1]] }),
  })
    .getSchema()
    .openapi('Sort')
}