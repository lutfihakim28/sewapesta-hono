import { createRoute } from '@hono/zod-openapi'
import { SuccessSchema } from '@/lib/schemas/Success.schema'
import { OpenApiResponse } from '@/lib/dtos/OpenApiResponse.dto'
import { ParamIdSchema } from '@/lib/schemas/ParamId.schema'
import { InventoryMutationFilterSchema, InventoryMutationRequestSchema, InventoryMutationResponseDataSchema, InventoryMutationResponseListSchema } from './InventoryMutation.schema'

const tag = 'Inventory Mutation'

export const InventoryMutationListRoute = createRoute({
  method: 'get',
  path: '/',
  tags: [tag],
  request: {
    query: InventoryMutationFilterSchema,
  },
  responses: new OpenApiResponse({
    successResponse: { schema: InventoryMutationResponseListSchema, description: 'Get list inventory mutations' },
    codes: [401, 403, 422],
  }),
})

export const InventoryMutationDetailRoute = createRoute({
  method: 'get',
  path: '/{id}',
  tags: [tag],
  request: {
    params: ParamIdSchema,
  },
  responses: new OpenApiResponse({
    successResponse: { schema: InventoryMutationResponseDataSchema, description: 'Get detail ivnentory mutation' },
    codes: [401, 403, 404],
  }),
})

export const InventoryMutationCreateRoute = createRoute({
  method: 'post',
  path: '/',
  tags: [tag],
  request: {
    body: {
      content: {
        'application/json': {
          schema: InventoryMutationRequestSchema
        }
      },
    }
  },
  responses: new OpenApiResponse({
    successResponse: { schema: InventoryMutationResponseDataSchema, description: 'Inventory mutation created' },
    codes: [401, 403, 422],
  }),
})

export const InventoryMutationUpdateRoute = createRoute({
  method: 'put',
  path: '/{id}',
  tags: [tag],
  request: {
    params: ParamIdSchema,
    body: {
      content: {
        'application/json': {
          schema: InventoryMutationRequestSchema
        }
      },
    }
  },
  responses: new OpenApiResponse({
    successResponse: { schema: InventoryMutationResponseDataSchema, description: 'Inventory mutation updated' },
    codes: [401, 403, 404, 422],
  }),
})

export const InventoryMutationDeleteRoute = createRoute({
  method: 'delete',
  path: '/{id}',
  tags: [tag],
  request: {
    params: ParamIdSchema,
  },
  responses: new OpenApiResponse({
    successResponse: { schema: SuccessSchema, description: 'Inventory mutation deleted' },
    codes: [401, 403, 404]
  }),
})