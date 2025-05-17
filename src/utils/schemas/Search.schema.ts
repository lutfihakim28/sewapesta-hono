import { StringSchema } from './String.schema';
import { ObjectSchema } from './Object.schema';

export const SearchSchema = new ObjectSchema({
  keyword: new StringSchema('Message').min(3).getSchema().optional(),
}).getSchema().openapi('Search')