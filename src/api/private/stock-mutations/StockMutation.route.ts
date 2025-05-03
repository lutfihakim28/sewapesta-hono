import {
  StockMutationFilterSchema, StockMutationRequestSchema, StockMutationResponseDataSchema,
  StockMutationResponseListSchema,
} from '@/api/private/stock-mutations/StockMutation.schema';
import { OpenApiResponse } from '@/lib/dtos/OpenApiResponse.dto';
import { ParamIdSchema } from '@/lib/schemas/ParamId.schema';
import { SuccessSchema } from '@/lib/schemas/Success.schema';
import { createRoute } from '@hono/zod-openapi';

const tag = 'Item Mutation'

export const StockMutationListRoute = createRoute({
  method: 'get',
  path: '/',
  tags: [tag],
  request: {
    query: StockMutationFilterSchema,
  },
  responses: new OpenApiResponse({
    successResponse: { schema: StockMutationResponseListSchema, description: 'Retrieve list mutations' },
    codes: [401, 403, 422],
  }),
})

export const StockMutationDetailRoute = createRoute({
  method: 'get',
  path: '/{id}',
  tags: [tag],
  request: {
    params: ParamIdSchema,
  },
  responses: new OpenApiResponse({
    successResponse: { schema: StockMutationResponseDataSchema, description: 'Retrieve detail mutation' },
    codes: [401, 403, 404],
  }),
})

export const StockMutationCreateRoute = createRoute({
  method: 'post',
  path: '/',
  tags: [tag],
  request: {
    body: {
      content: {
        'application/json': {
          schema: StockMutationRequestSchema
        }
      }
    }
  },
  responses: new OpenApiResponse({
    successResponse: { schema: StockMutationResponseDataSchema, description: 'Mutation created' },
    codes: [401, 403, 422],
  }),
})

export const StockMutationUpdateRoute = createRoute({
  method: 'put',
  path: '/{id}',
  tags: [tag],
  request: {
    params: ParamIdSchema,
    body: {
      content: {
        'application/json': {
          schema: StockMutationRequestSchema,
        }
      }
    }
  },
  responses: new OpenApiResponse({
    successResponse: { schema: StockMutationResponseDataSchema, description: 'Mutation updated' },
    codes: [401, 403, 404, 422],
  }),
})

export const StockMutationDeleteRoute = createRoute({
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