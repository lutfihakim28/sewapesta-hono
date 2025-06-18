import { ObjectSchema } from './Object.schema';
import { StringSchema } from './String.schema';
import { SortDirectionEnum } from '../enums/SortDirectionEnum';
import { EnumSchema } from './Enum.schema';

export function SortSchema<T extends string>(columns: T[]) {
  return new ObjectSchema({
    sort: new StringSchema('sort')
      .getSchema()
      .optional()
      .openapi({ description: `Allowed columns are ${columns.join(', ')}`, example: columns[0] }),
    sortDirection: new EnumSchema('sortDirection', SortDirectionEnum)
      .getSchema()
      .optional()
      .openapi({ description: `Allowed sortDirection are ${Object.values(SortDirectionEnum).join(', ')}`, example: SortDirectionEnum.Asc }),
  })
    .getSchema()
    .openapi('Sort')
}