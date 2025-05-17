import { createRoute } from '@hono/zod-openapi'
import { SuccessSchema } from '@/utils/schemas/Success.schema'
import { OpenApiResponse } from '@/utils/dtos/OpenApiResponse.dto'
import { ParamIdSchema } from '@/utils/schemas/ParamId.schema'
import { InventoryDamageReportFilterSchema, InventoryDamageReportRequestSchema, InventoryDamageReportResponseDataSchema, InventoryDamageReportResponseListSchema } from './InventoryDamageReport.schema'

const tag = 'Inventory Damage Report'

export const InventoryDamageReportListRoute = createRoute({
  method: 'get',
  path: '/',
  tags: [tag],
  request: {
    query: InventoryDamageReportFilterSchema,
  },
  responses: new OpenApiResponse({
    successResponse: { schema: InventoryDamageReportResponseListSchema, description: 'Get list inventory damage reports' },
    codes: [401, 403, 422],
  }),
})

export const InventoryDamageReportDetailRoute = createRoute({
  method: 'get',
  path: '/{id}',
  tags: [tag],
  request: {
    params: ParamIdSchema,
  },
  responses: new OpenApiResponse({
    successResponse: { schema: InventoryDamageReportResponseDataSchema, description: 'Get detail inventory damage report' },
    codes: [401, 403, 404],
  }),
})

export const InventoryDamageReportCreateRoute = createRoute({
  method: 'post',
  path: '/',
  tags: [tag],
  request: {
    body: {
      content: {
        'application/json': {
          schema: InventoryDamageReportRequestSchema
        }
      },
    }
  },
  responses: new OpenApiResponse({
    successResponse: { schema: InventoryDamageReportResponseDataSchema, description: 'Inventory damage report created' },
    codes: [401, 403, 422],
  }),
})

export const InventoryDamageReportUpdateRoute = createRoute({
  method: 'put',
  path: '/{id}',
  tags: [tag],
  request: {
    params: ParamIdSchema,
    body: {
      content: {
        'application/json': {
          schema: InventoryDamageReportRequestSchema
        }
      },
    }
  },
  responses: new OpenApiResponse({
    successResponse: { schema: InventoryDamageReportResponseDataSchema, description: 'Inventory damage report updated' },
    codes: [401, 403, 404, 422],
  }),
})

export const InventoryDamageReportDeleteRoute = createRoute({
  method: 'delete',
  path: '/{id}',
  tags: [tag],
  request: {
    params: ParamIdSchema,
  },
  responses: new OpenApiResponse({
    successResponse: { schema: SuccessSchema, description: 'Inventory damage report deleted' },
    codes: [401, 403, 404]
  }),
})