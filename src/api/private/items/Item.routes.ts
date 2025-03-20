import { createRoute } from '@hono/zod-openapi';
import { ItemFilterSchema, ItemListSchema } from './Item.schema';
import { OpenApiResponse } from '@/lib/dtos/OpenApiResponse.dto';

export const ItemListRoute = createRoute({
  method: 'get',
  path: '/',
  tags: ['Item'],
  request: {
    query: ItemFilterSchema,
  },
  responses: new OpenApiResponse({
    successResponse: { schema: ItemListSchema, description: 'Retrieve list branches' },
    codes: [401, 403],
  }),
})