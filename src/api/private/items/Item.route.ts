import { createRoute } from '@hono/zod-openapi';
import { ItemResponseDataSchema, ItemFilterSchema, ItemResponseListSchema, ItemRequestSchema } from './Item.schema';
import { OpenApiResponse } from '@/lib/dtos/OpenApiResponse.dto';
import { ParamIdSchema } from '@/lib/schemas/ParamId.schema';
import { SuccessSchema } from '@/lib/schemas/Success.schema';

const tag = 'Item'

export const ItemListRoute = createRoute({
  method: 'get',
  path: '/',
  tags: [tag],
  request: {
    query: ItemFilterSchema,
  },
  responses: new OpenApiResponse({
    successResponse: { schema: ItemResponseListSchema, description: 'Retrieve list items' },
    codes: [401, 403, 422],
  }),
})

export const ItemDetailRoute = createRoute({
  method: 'get',
  path: '/{id}',
  tags: [tag],
  request: {
    params: ParamIdSchema,
  },
  responses: new OpenApiResponse({
    successResponse: { schema: ItemResponseDataSchema, description: 'Retrieve detail item' },
    codes: [401, 403],
  }),
})

export const ItemCreateRoute = createRoute({
  method: 'post',
  path: '/',
  tags: [tag],
  request: {
    body: {
      content: {
        'application/json': {
          schema: ItemRequestSchema
        }
      },
    }
  },
  responses: new OpenApiResponse({
    successResponse: { schema: ItemResponseDataSchema, description: 'Item created' },
    codes: [401, 403, 422],
  }),
})

export const ItemUpdateRoute = createRoute({
  method: 'put',
  path: '/{id}',
  tags: [tag],
  request: {
    params: ParamIdSchema,
    body: {
      content: {
        'application/json': {
          schema: ItemRequestSchema
        }
      },
    }
  },
  responses: new OpenApiResponse({
    successResponse: { schema: ItemResponseDataSchema, description: 'Item updated' },
    codes: [401, 403, 404, 422],
  }),
})

export const ItemDeleteRoute = createRoute({
  method: 'delete',
  path: '/{id}',
  tags: [tag],
  request: {
    params: ParamIdSchema,
  },
  responses: new OpenApiResponse({
    successResponse: { schema: SuccessSchema, description: 'Item deleted' },
    codes: [401, 403, 404],
  }),
})