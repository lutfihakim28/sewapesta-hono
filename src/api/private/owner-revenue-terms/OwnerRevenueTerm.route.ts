import { createRoute } from '@hono/zod-openapi'
import { SuccessSchema } from '@/utils/schemas/Success.schema'
import { OpenApiResponse } from '@/utils/dtos/OpenApiResponse.dto'
import { ParamIdSchema } from '@/utils/schemas/ParamId.schema'
import { OwnerRevenueTermFilterSchema, OwnerRevenueTermRequestSchema, OwnerRevenueTermResponseDataSchema, OwnerRevenueTermResponseListSchema } from './OwnerRevenueTerm.schema'

const tag = 'Owner Revenue Term'

export const OwnerRevenueTermListRoute = createRoute({
  method: 'get',
  path: '/',
  tags: [tag],
  request: {
    query: OwnerRevenueTermFilterSchema,
  },
  responses: new OpenApiResponse({
    successResponse: { schema: OwnerRevenueTermResponseListSchema, description: 'Get list owner revenue terms' },
    codes: [401, 403, 422],
  }),
})

export const OwnerRevenueTermDetailRoute = createRoute({
  method: 'get',
  path: '/{id}',
  tags: [tag],
  request: {
    params: ParamIdSchema,
  },
  responses: new OpenApiResponse({
    successResponse: { schema: OwnerRevenueTermResponseDataSchema, description: 'Get detail owner revenue term' },
    codes: [401, 403, 404],
  }),
})

export const OwnerRevenueTermCreateRoute = createRoute({
  method: 'post',
  path: '/',
  tags: [tag],
  request: {
    body: {
      content: {
        'application/json': {
          schema: OwnerRevenueTermRequestSchema
        }
      },
    }
  },
  responses: new OpenApiResponse({
    successResponse: { schema: OwnerRevenueTermResponseDataSchema, description: 'Owner revenue term created' },
    codes: [401, 403, 422],
  }),
})

export const OwnerRevenueTermUpdateRoute = createRoute({
  method: 'put',
  path: '/{id}',
  tags: [tag],
  request: {
    params: ParamIdSchema,
    body: {
      content: {
        'application/json': {
          schema: OwnerRevenueTermRequestSchema
        }
      },
    }
  },
  responses: new OpenApiResponse({
    successResponse: { schema: OwnerRevenueTermResponseDataSchema, description: 'Owner revenue term updated' },
    codes: [401, 403, 404, 422],
  }),
})

export const OwnerRevenueTermDeleteRoute = createRoute({
  method: 'delete',
  path: '/{id}',
  tags: [tag],
  request: {
    params: ParamIdSchema,
  },
  responses: new OpenApiResponse({
    successResponse: { schema: SuccessSchema, description: 'Owner revenue term deleted' },
    codes: [401, 403, 404]
  }),
})