import { createRoute } from '@hono/zod-openapi'
import { SuccessSchema } from '@/utils/schemas/Success.schema'
import { OpenApiResponse } from '@/utils/dtos/OpenApiResponse.dto'
import { ParamIdSchema } from '@/utils/schemas/ParamId.schema'
import { InventoryUsageFilterSchema, InventoryUsageRequestSchema, InventoryUsageResponseDataSchema, InventoryUsageResponseListSchema } from './InventoryUsage.schema'

const tag = 'Inventory Usage'

export const InventoryUsageListRoute = createRoute({
  method: 'get',
  path: '/',
  tags: [tag],
  request: {
    query: InventoryUsageFilterSchema,
  },
  responses: new OpenApiResponse({
    successResponse: { schema: InventoryUsageResponseListSchema, description: 'Get list inventory usages' },
    codes: [401, 403, 422],
  }),
})

export const InventoryUsageDetailRoute = createRoute({
  method: 'get',
  path: '/{id}',
  tags: [tag],
  request: {
    params: ParamIdSchema,
  },
  responses: new OpenApiResponse({
    successResponse: { schema: InventoryUsageResponseDataSchema, description: 'Get detail inventory usage' },
    codes: [401, 403, 404],
  }),
})

export const InventoryUsageCreateRoute = createRoute({
  method: 'post',
  path: '/',
  tags: [tag],
  request: {
    body: {
      content: {
        'application/json': {
          schema: InventoryUsageRequestSchema
        }
      },
    }
  },
  responses: new OpenApiResponse({
    successResponse: { schema: InventoryUsageResponseDataSchema, description: 'Inventory usage created' },
    codes: [401, 403, 422],
  }),
})

export const InventoryUsageUpdateRoute = createRoute({
  method: 'put',
  path: '/{id}',
  tags: [tag],
  request: {
    params: ParamIdSchema,
    body: {
      content: {
        'application/json': {
          schema: InventoryUsageRequestSchema
        }
      },
    }
  },
  responses: new OpenApiResponse({
    successResponse: { schema: InventoryUsageResponseDataSchema, description: 'Inventory usage updated' },
    codes: [401, 403, 404, 422],
  }),
})

export const InventoryUsageDeleteRoute = createRoute({
  method: 'delete',
  path: '/{id}',
  tags: [tag],
  request: {
    params: ParamIdSchema,
  },
  responses: new OpenApiResponse({
    successResponse: { schema: SuccessSchema, description: 'Inventory usage deleted' },
    codes: [401, 403, 404]
  }),
})