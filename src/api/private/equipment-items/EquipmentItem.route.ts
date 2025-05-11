import { createRoute } from '@hono/zod-openapi'
import { SuccessSchema } from '@/lib/schemas/Success.schema'
import { OpenApiResponse } from '@/lib/dtos/OpenApiResponse.dto'
import { ParamIdSchema } from '@/lib/schemas/ParamId.schema'
import { UniqueCheckSchema } from '@/lib/schemas/UniqueCheck.schema'
import { EquipmentItemFilterSchema, EquipmentItemRequestSchema, EquipmentItemResponseDataSchema, EquipmentItemResponseListSchema } from './EquipmentItem.schema'

const tag = 'Equipment Item'

export const EquipmentItemListRoute = createRoute({
  method: 'get',
  path: '/',
  tags: [tag],
  request: {
    query: EquipmentItemFilterSchema,
  },
  responses: new OpenApiResponse({
    successResponse: { schema: EquipmentItemResponseListSchema, description: 'Get list equipment items' },
    codes: [401, 403],
  }),
})

export const EquipmentItemDetailRoute = createRoute({
  method: 'get',
  path: '/{id}',
  tags: [tag],
  request: {
    params: ParamIdSchema,
  },
  responses: new OpenApiResponse({
    successResponse: { schema: EquipmentItemResponseDataSchema, description: 'Equipment item created' },
    codes: [401, 403, 404, 422],
  }),
})

export const EquipmentItemCreateRoute = createRoute({
  method: 'post',
  path: '/',
  tags: [tag],
  request: {
    body: {
      content: {
        'application/json': {
          schema: EquipmentItemRequestSchema
        }
      },
    }
  },
  responses: new OpenApiResponse({
    successResponse: { schema: EquipmentItemResponseDataSchema, description: 'Equipment item created' },
    codes: [401, 403, 422],
  }),
})

export const EquipmentItemUpdateRoute = createRoute({
  method: 'put',
  path: '/{id}',
  tags: [tag],
  request: {
    params: ParamIdSchema,
    body: {
      content: {
        'application/json': {
          schema: EquipmentItemRequestSchema
        }
      },
    }
  },
  responses: new OpenApiResponse({
    successResponse: { schema: EquipmentItemResponseDataSchema, description: 'Equipment item updated' },
    codes: [401, 403, 404, 422],
  }),
})

export const EquipmentItemDeleteRoute = createRoute({
  method: 'delete',
  path: '/{id}',
  tags: [tag],
  request: {
    params: ParamIdSchema,
  },
  responses: new OpenApiResponse({
    successResponse: { schema: SuccessSchema, description: 'Equipment item deleted' },
    codes: [401, 403, 404]
  }),
})