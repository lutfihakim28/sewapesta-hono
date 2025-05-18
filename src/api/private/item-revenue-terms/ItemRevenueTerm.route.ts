import { createRoute } from '@hono/zod-openapi'
import { SuccessSchema } from '@/utils/schemas/Success.schema'
import { OpenApiResponse } from '@/utils/dtos/OpenApiResponse.dto'
import { ParamIdSchema } from '@/utils/schemas/ParamId.schema'
import { ItemRevenueTermFilterSchema, ItemRevenueTermRequestSchema, ItemRevenueTermResponseDataSchema, ItemRevenueTermResponseListSchema } from './ItemRevenueTerm.schema'

const tag = 'Item Revenue Term'

export const ItemRevenueTermListRoute = createRoute({
  method: 'get',
  path: '/',
  tags: [tag],
  request: {
    query: ItemRevenueTermFilterSchema,
  },
  responses: new OpenApiResponse({
    successResponse: { schema: ItemRevenueTermResponseListSchema, description: 'Get list item revenue terms' },
    codes: [401, 403, 422],
  }),
})

export const ItemRevenueTermDetailRoute = createRoute({
  method: 'get',
  path: '/{id}',
  tags: [tag],
  request: {
    params: ParamIdSchema,
  },
  responses: new OpenApiResponse({
    successResponse: { schema: ItemRevenueTermResponseDataSchema, description: 'Get detail item revenue term' },
    codes: [401, 403, 404],
  }),
})

export const ItemRevenueTermCreateRoute = createRoute({
  method: 'post',
  path: '/',
  tags: [tag],
  request: {
    body: {
      content: {
        'application/json': {
          schema: ItemRevenueTermRequestSchema
        }
      },
    }
  },
  responses: new OpenApiResponse({
    successResponse: { schema: ItemRevenueTermResponseDataSchema, description: 'Item revenue term created' },
    codes: [401, 403, 422],
  }),
})

export const ItemRevenueTermUpdateRoute = createRoute({
  method: 'put',
  path: '/{id}',
  tags: [tag],
  request: {
    params: ParamIdSchema,
    body: {
      content: {
        'application/json': {
          schema: ItemRevenueTermRequestSchema
        }
      },
    }
  },
  responses: new OpenApiResponse({
    successResponse: { schema: ItemRevenueTermResponseDataSchema, description: 'Item revenue term updated' },
    codes: [401, 403, 404, 422],
  }),
})

export const ItemRevenueTermDeleteRoute = createRoute({
  method: 'delete',
  path: '/{id}',
  tags: [tag],
  request: {
    params: ParamIdSchema,
  },
  responses: new OpenApiResponse({
    successResponse: { schema: SuccessSchema, description: 'Item revenue term deleted' },
    codes: [401, 403, 404]
  }),
})