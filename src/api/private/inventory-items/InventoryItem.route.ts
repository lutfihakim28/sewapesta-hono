import { createRoute } from '@hono/zod-openapi'
import { SuccessSchema } from '@/lib/schemas/Success.schema'
import { OpenApiResponse } from '@/lib/dtos/OpenApiResponse.dto'
import { ParamIdSchema } from '@/lib/schemas/ParamId.schema'
import { InventoryItemFilterSchema, InventoryItemRequestSchema, InventoryItemResponseDataSchema, InventoryItemResponseListSchema } from './InventoryItem.schema'

const tag = 'InventoryItem'

export const InventoryItemListRoute = createRoute({
  method: 'get',
  path: '/',
  tags: [tag],
  request: {
    query: InventoryItemFilterSchema,
  },
  responses: new OpenApiResponse({
    successResponse: { schema: InventoryItemResponseListSchema, description: 'Get list inventory items' },
    codes: [401, 403, 422],
  }),
})

export const InventoryItemDetailRoute = createRoute({
  method: 'get',
  path: '/{id}',
  tags: [tag],
  request: {
    params: ParamIdSchema,
  },
  responses: new OpenApiResponse({
    successResponse: { schema: InventoryItemResponseDataSchema, description: 'Get detail ivnentory item' },
    codes: [401, 403, 404],
  }),
})

export const InventoryItemCreateRoute = createRoute({
  method: 'post',
  path: '/',
  tags: [tag],
  request: {
    body: {
      content: {
        'application/json': {
          schema: InventoryItemRequestSchema
        }
      },
    }
  },
  responses: new OpenApiResponse({
    successResponse: { schema: InventoryItemResponseDataSchema, description: 'InventoryItem created' },
    codes: [401, 403, 422],
  }),
})

export const InventoryItemUpdateRoute = createRoute({
  method: 'put',
  path: '/{id}',
  tags: [tag],
  request: {
    params: ParamIdSchema,
    body: {
      content: {
        'application/json': {
          schema: InventoryItemRequestSchema
        }
      },
    }
  },
  responses: new OpenApiResponse({
    successResponse: { schema: InventoryItemResponseDataSchema, description: 'InventoryItem updated' },
    codes: [401, 403, 404, 422],
  }),
})

export const InventoryItemDeleteRoute = createRoute({
  method: 'delete',
  path: '/{id}',
  tags: [tag],
  request: {
    params: ParamIdSchema,
  },
  responses: new OpenApiResponse({
    successResponse: { schema: SuccessSchema, description: 'InventoryItem deleted' },
    codes: [401, 403, 404]
  }),
})