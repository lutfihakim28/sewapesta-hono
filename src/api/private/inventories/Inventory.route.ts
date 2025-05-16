import { createRoute } from '@hono/zod-openapi'
import { SuccessSchema } from '@/utils/schemas/Success.schema'
import { OpenApiResponse } from '@/utils/dtos/OpenApiResponse.dto'
import { ParamIdSchema } from '@/utils/schemas/ParamId.schema'
import { InventoryFilterSchema, InventoryRequestSchema, InventoryResponseDataSchema, InventoryResponseListSchema } from './Inventory.schema'

const tag = 'Inventory'

export const InventoryListRoute = createRoute({
  method: 'get',
  path: '/',
  tags: [tag],
  request: {
    query: InventoryFilterSchema,
  },
  responses: new OpenApiResponse({
    successResponse: { schema: InventoryResponseListSchema, description: 'Get list inventories' },
    codes: [401, 403, 422],
  }),
})

export const InventoryDetailRoute = createRoute({
  method: 'get',
  path: '/{id}',
  tags: [tag],
  request: {
    params: ParamIdSchema,
  },
  responses: new OpenApiResponse({
    successResponse: { schema: InventoryResponseDataSchema, description: 'Get detail ivnentory' },
    codes: [401, 403, 404],
  }),
})

export const InventoryCreateRoute = createRoute({
  method: 'post',
  path: '/',
  tags: [tag],
  request: {
    body: {
      content: {
        'application/json': {
          schema: InventoryRequestSchema
        }
      },
    }
  },
  responses: new OpenApiResponse({
    successResponse: { schema: InventoryResponseDataSchema, description: 'Inventory created' },
    codes: [401, 403, 422],
  }),
})

export const InventoryUpdateRoute = createRoute({
  method: 'put',
  path: '/{id}',
  tags: [tag],
  request: {
    params: ParamIdSchema,
    body: {
      content: {
        'application/json': {
          schema: InventoryRequestSchema
        }
      },
    }
  },
  responses: new OpenApiResponse({
    successResponse: { schema: InventoryResponseDataSchema, description: 'Inventory updated' },
    codes: [401, 403, 404, 422],
  }),
})

export const InventoryDeleteRoute = createRoute({
  method: 'delete',
  path: '/{id}',
  tags: [tag],
  request: {
    params: ParamIdSchema,
  },
  responses: new OpenApiResponse({
    successResponse: { schema: SuccessSchema, description: 'Inventory deleted' },
    codes: [401, 403, 404]
  }),
})