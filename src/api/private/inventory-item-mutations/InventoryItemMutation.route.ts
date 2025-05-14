import { createRoute } from '@hono/zod-openapi'
import { SuccessSchema } from '@/lib/schemas/Success.schema'
import { OpenApiResponse } from '@/lib/dtos/OpenApiResponse.dto'
import { ParamIdSchema } from '@/lib/schemas/ParamId.schema'
import { InventoryItemMutationFilterSchema, InventoryItemMutationRequestSchema, InventoryItemMutationResponseDataSchema, InventoryItemMutationResponseListSchema } from './InventoryItemMutation.schema'

const tag = 'Inventory Item Mutation'

export const InventoryItemMutationListRoute = createRoute({
  method: 'get',
  path: '/',
  tags: [tag],
  request: {
    query: InventoryItemMutationFilterSchema,
  },
  responses: new OpenApiResponse({
    successResponse: { schema: InventoryItemMutationResponseListSchema, description: 'Get list inventory item mutations' },
    codes: [401, 403, 422],
  }),
})

export const InventoryItemMutationDetailRoute = createRoute({
  method: 'get',
  path: '/{id}',
  tags: [tag],
  request: {
    params: ParamIdSchema,
  },
  responses: new OpenApiResponse({
    successResponse: { schema: InventoryItemMutationResponseDataSchema, description: 'Get detail ivnentory item mutation' },
    codes: [401, 403, 404],
  }),
})

export const InventoryItemMutationCreateRoute = createRoute({
  method: 'post',
  path: '/',
  tags: [tag],
  request: {
    body: {
      content: {
        'application/json': {
          schema: InventoryItemMutationRequestSchema
        }
      },
    }
  },
  responses: new OpenApiResponse({
    successResponse: { schema: InventoryItemMutationResponseDataSchema, description: 'Inventory item mutation created' },
    codes: [401, 403, 422],
  }),
})

export const InventoryItemMutationUpdateRoute = createRoute({
  method: 'put',
  path: '/{id}',
  tags: [tag],
  request: {
    params: ParamIdSchema,
    body: {
      content: {
        'application/json': {
          schema: InventoryItemMutationRequestSchema
        }
      },
    }
  },
  responses: new OpenApiResponse({
    successResponse: { schema: InventoryItemMutationResponseDataSchema, description: 'Inventory item mutation updated' },
    codes: [401, 403, 404, 422],
  }),
})

export const InventoryItemMutationDeleteRoute = createRoute({
  method: 'delete',
  path: '/{id}',
  tags: [tag],
  request: {
    params: ParamIdSchema,
  },
  responses: new OpenApiResponse({
    successResponse: { schema: SuccessSchema, description: 'Inventory item mutation deleted' },
    codes: [401, 403, 404]
  }),
})