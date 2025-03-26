import {
  ItemMutationFilterSchema, ItemMutationRequestSchema, ItemMutationResponseDataSchema,
  ItemMutationResponseListSchema,
} from '@/api/private/item-mutations/ItemMutation.schema';
import { OpenApiResponse } from '@/lib/dtos/OpenApiResponse.dto';
import { ParamIdSchema } from '@/lib/schemas/ParamId.schema';
import { SuccessSchema } from '@/lib/schemas/Success.schema';
import { createRoute } from '@hono/zod-openapi';

const tag = 'Item Mutation'

export const ItemMutationListRoute = createRoute({
  method: 'get',
  path: '/',
  tags: [tag],
  request: {
    query: ItemMutationFilterSchema,
  },
  responses: new OpenApiResponse({
    successResponse: { schema: ItemMutationResponseListSchema, description: 'Retrieve list mutations' },
    codes: [401, 403, 422],
  }),
})

export const ItemMutationDetailRoute = createRoute({
  method: 'get',
  path: '/{id}',
  tags: [tag],
  request: {
    params: ParamIdSchema,
  },
  responses: new OpenApiResponse({
    successResponse: { schema: ItemMutationResponseDataSchema, description: 'Retrieve detail mutation' },
    codes: [401, 403, 404],
  }),
})

export const ItemMutationCreateRoute = createRoute({
  method: 'post',
  path: '/',
  tags: [tag],
  request: {
    body: {
      content: {
        'application/json': {
          schema: ItemMutationRequestSchema
        }
      }
    }
  },
  responses: new OpenApiResponse({
    successResponse: { schema: ItemMutationResponseDataSchema, description: 'Mutation created' },
    codes: [401, 403, 422],
  }),
})

export const ItemMutationUpdateRoute = createRoute({
  method: 'put',
  path: '/{id}',
  tags: [tag],
  request: {
    params: ParamIdSchema,
    body: {
      content: {
        'application/json': {
          schema: ItemMutationRequestSchema,
        }
      }
    }
  },
  responses: new OpenApiResponse({
    successResponse: { schema: ItemMutationResponseDataSchema, description: 'Mutation updated' },
    codes: [401, 403, 404, 422],
  }),
})

export const ItemMutationDeleteRoute = createRoute({
  method: 'delete',
  path: '/{id}',
  tags: [tag],
  request: {
    params: ParamIdSchema,
  },
  responses: new OpenApiResponse({
    successResponse: { schema: SuccessSchema, description: 'Mutation deleted' },
    codes: [401, 403, 404],
  })
})