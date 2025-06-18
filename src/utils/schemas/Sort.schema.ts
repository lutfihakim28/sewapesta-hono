import { ObjectSchema } from './Object.schema';
import { StringSchema } from './String.schema';
import { SortByEnum } from '../enums/SortByEnum';
import { EnumSchema } from './Enum.schema';

export function SortSchema<T extends string>(columns: T[]) {
  return new ObjectSchema({
    sort: new StringSchema('sort')
      .getSchema()
      .optional()
      .openapi({ description: `Allowed columns are ${columns.join(', ')}`, example: columns[0] }),
    sortBy: new EnumSchema('sortBy', SortByEnum)
      .getSchema()
      .optional()
      .openapi({ description: `Allowed sortBy are ${Object.values(SortByEnum).join(', ')}`, example: SortByEnum.Asc }),
  })
    .getSchema()
    .openapi('Sort')
}