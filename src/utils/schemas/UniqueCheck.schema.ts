import { StringSchema } from './String.schema';
import { ObjectSchema } from './Object.schema';
import { SchemaType } from '../types/Schema.type';

export const UniqueCheckSchema = new ObjectSchema({
  unique: new StringSchema('Unique').getSchema(),
  selectedId: new StringSchema('Selected ID').numeric({ min: 1, subset: 'natural' }).getSchema().optional()
}).getSchema().openapi('UniqueCheck')

export type UniqueCheck = SchemaType<typeof UniqueCheckSchema>