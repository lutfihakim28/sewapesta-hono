import { createRoute } from '@hono/zod-openapi'
import { SuccessSchema } from '@/lib/schemas/Success.schema'
import { OpenApiResponse } from '@/lib/dtos/OpenApiResponse.dto'
import { ParamIdSchema } from '@/lib/schemas/ParamId.schema'
import { EquipmentFilterSchema, EquipmentRequestSchema, EquipmentResponseDataSchema, EquipmentResponseListSchema } from './Equipment.schema'

const tag = 'Equipment'

export const EquipmentListRoute = createRoute({
  method: 'get',
  path: '/',
  tags: [tag],
  request: {
    query: EquipmentFilterSchema,
  },
  responses: new OpenApiResponse({
    successResponse: { schema: EquipmentResponseListSchema, description: 'Get list equipment items' },
    codes: [401, 403],
  }),
})

export const EquipmentDetailRoute = createRoute({
  method: 'get',
  path: '/{id}',
  tags: [tag],
  request: {
    params: ParamIdSchema,
  },
  responses: new OpenApiResponse({
    successResponse: { schema: EquipmentResponseDataSchema, description: 'Equipment created' },
    codes: [401, 403, 404, 422],
  }),
})

export const EquipmentCreateRoute = createRoute({
  method: 'post',
  path: '/',
  tags: [tag],
  request: {
    body: {
      content: {
        'application/json': {
          schema: EquipmentRequestSchema
        }
      },
    }
  },
  responses: new OpenApiResponse({
    successResponse: { schema: EquipmentResponseDataSchema, description: 'Equipment created' },
    codes: [401, 403, 422],
  }),
})

export const EquipmentUpdateRoute = createRoute({
  method: 'put',
  path: '/{id}',
  tags: [tag],
  request: {
    params: ParamIdSchema,
    body: {
      content: {
        'application/json': {
          schema: EquipmentRequestSchema
        }
      },
    }
  },
  responses: new OpenApiResponse({
    successResponse: { schema: EquipmentResponseDataSchema, description: 'Equipment updated' },
    codes: [401, 403, 404, 422],
  }),
})

export const EquipmentDeleteRoute = createRoute({
  method: 'delete',
  path: '/{id}',
  tags: [tag],
  request: {
    params: ParamIdSchema,
  },
  responses: new OpenApiResponse({
    successResponse: { schema: SuccessSchema, description: 'Equipment deleted' },
    codes: [401, 403, 404]
  }),
})