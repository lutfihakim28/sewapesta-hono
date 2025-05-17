import { z } from '@hono/zod-openapi';
import { StringSchema } from './String.schema';
import { ObjectSchema } from './Object.schema';

export const PaginationSchema = new ObjectSchema({
  page: new StringSchema('Product ID').numeric({ min: 1, subset: 'natural' }).getSchema().optional().openapi({ example: '1' }),
  pageSize: new StringSchema('Product ID').numeric({ min: 5, subset: 'natural' }).getSchema().optional().openapi({ example: '10' }),
}).getSchema().openapi('Pagination')