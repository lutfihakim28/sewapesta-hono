import { createRoute } from '@hono/zod-openapi'
import { SuccessSchema } from '@/utils/schemas/Success.schema'
import { OpenApiResponse } from '@/utils/dtos/OpenApiResponse.dto'
import { UnitFilterSchema, UnitRequestSchema, UnitResponseSchema } from './Unit.schema'
import { ParamIdSchema } from '@/utils/schemas/ParamId.schema'
import { UniqueCheckSchema } from '@/utils/schemas/UniqueCheck.schema'

const tag = 'Unit'

export const UnitListRoute = createRoute({
  method: 'get',
  path: '/',
  tags: [tag],
  request: {
    query: UnitFilterSchema,
  },
  responses: new OpenApiResponse({
    successResponse: { schema: UnitResponseSchema, description: 'Retrieve list units' },
    codes: [401, 403],
  }),
})

export const UnitCreateRoute = createRoute({
  method: 'post',
  path: '/',
  tags: [tag],
  request: {
    body: {
      content: {
        'application/json': {
          schema: UnitRequestSchema
        }
      },
    }
  },
  responses: new OpenApiResponse({
    successResponse: { schema: SuccessSchema, description: 'Unit created' },
    codes: [401, 403, 422],
  }),
})

export const UnitUpdateRoute = createRoute({
  method: 'put',
  path: '/{id}',
  tags: [tag],
  request: {
    params: ParamIdSchema,
    body: {
      content: {
        'application/json': {
          schema: UnitRequestSchema
        }
      },
    }
  },
  responses: new OpenApiResponse({
    successResponse: { schema: SuccessSchema, description: 'Unit updated' },
    codes: [401, 403, 404, 422],
  }),
})

export const UnitDeleteRoute = createRoute({
  method: 'delete',
  path: '/{id}',
  tags: [tag],
  request: {
    params: ParamIdSchema,
  },
  responses: new OpenApiResponse({
    successResponse: { schema: SuccessSchema, description: 'Unit deleted' },
    codes: [401, 403, 404]
  }),
})

export const UnitCheckRoute = createRoute({
  method: 'get',
  path: '/check-uniques',
  tags: [tag],
  request: {
    query: UniqueCheckSchema,
  },
  responses: new OpenApiResponse({
    successResponse: { schema: SuccessSchema, description: 'Unit\'s name is available' },
    codes: [401, 403, 404, 422],
  }),
})