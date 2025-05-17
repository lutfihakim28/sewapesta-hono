import { NumberSchema } from './Number.schema';
import { ObjectSchema } from './Object.schema';

export const MetaSchema = new ObjectSchema({
  page: new NumberSchema('Page').natural().getSchema().openapi({ example: 1 }),
  pageSize: new NumberSchema('Page size').natural().getSchema().openapi({ example: 10 }),
  pageCount: new NumberSchema('Page count').whole().getSchema().openapi({ example: 15 }),
  totalData: new NumberSchema('Total data').whole().getSchema().openapi({ example: 150 }),
}).getSchema().openapi('ResponseMeta')