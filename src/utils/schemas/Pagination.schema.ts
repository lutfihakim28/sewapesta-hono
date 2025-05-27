import { StringSchema } from './String.schema';
import { ObjectSchema } from './Object.schema';

export const PaginationSchema = new ObjectSchema({
  page: new StringSchema('Product ID').neutralNumeric().getSchema().optional().openapi({ example: '1' }),
  pageSize: new StringSchema('Product ID').neutralNumeric().getSchema().optional().openapi({ example: '10' }),
}).getSchema().openapi('Pagination')