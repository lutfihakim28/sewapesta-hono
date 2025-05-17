import { StringSchema } from './String.schema';
import { NumberSchema } from './Number.schema';
import { ObjectSchema } from './Object.schema';
import { SchemaType } from '../types/Schema.type';
import { UnionSchema } from './Union.schema';

export const OptionSchema = new ObjectSchema({
  value: new UnionSchema([new StringSchema('Value').getSchema(), new NumberSchema('Value').natural().getSchema()]).getSchema(),
  label: new StringSchema('Message').getSchema(),
}).getSchema().openapi('Option')

export const OptionQuerySchema = new ObjectSchema({
  keyword: new StringSchema('Keyword').getSchema().optional()
}).getSchema().openapi('OptionQuery')

export type Option = SchemaType<typeof OptionSchema>
export type OptionQuery = SchemaType<typeof OptionQuerySchema>