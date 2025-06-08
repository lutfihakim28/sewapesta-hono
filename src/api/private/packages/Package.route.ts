import { createRoute } from '@hono/zod-openapi'
import { SuccessSchema } from '@/utils/schemas/Success.schema'
import { OpenApiResponse } from '@/utils/dtos/OpenApiResponse.dto'
import { ParamIdSchema } from '@/utils/schemas/ParamId.schema'
import { PackageFilterSchema, PackageOptionResponseSchema, PackageRequestSchema, PackageResponseDataSchema, PackageResponseListSchema } from './Package.schema'

const tag = 'Package'

export const PackageListRoute = createRoute({
  method: 'get',
  path: '/',
  tags: [tag],
  request: {
    query: PackageFilterSchema,
  },
  responses: new OpenApiResponse({
    successResponse: { schema: PackageResponseListSchema, description: 'Get list packages' },
    codes: [401, 403, 422],
  }),
})

export const PackageOptionRoute = createRoute({
  method: 'get',
  path: '/options',
  tags: [tag],
  responses: new OpenApiResponse({
    successResponse: { schema: PackageOptionResponseSchema, description: 'Retrieve list package options' },
    codes: [401, 403],
  }),
})

export const PackageDetailRoute = createRoute({
  method: 'get',
  path: '/{id}',
  tags: [tag],
  request: {
    params: ParamIdSchema,
  },
  responses: new OpenApiResponse({
    successResponse: { schema: PackageResponseDataSchema, description: 'Get detail package' },
    codes: [401, 403, 404],
  }),
})

export const PackageCreateRoute = createRoute({
  method: 'post',
  path: '/',
  tags: [tag],
  request: {
    body: {
      content: {
        'application/json': {
          schema: PackageRequestSchema
        }
      },
    }
  },
  responses: new OpenApiResponse({
    successResponse: { schema: PackageResponseDataSchema, description: 'Package created' },
    codes: [401, 403, 422],
  }),
})

export const PackageUpdateRoute = createRoute({
  method: 'put',
  path: '/{id}',
  tags: [tag],
  request: {
    params: ParamIdSchema,
    body: {
      content: {
        'application/json': {
          schema: PackageRequestSchema
        }
      },
    }
  },
  responses: new OpenApiResponse({
    successResponse: { schema: PackageResponseDataSchema, description: 'Package updated' },
    codes: [401, 403, 404, 422],
  }),
})

export const PackageDeleteRoute = createRoute({
  method: 'delete',
  path: '/{id}',
  tags: [tag],
  request: {
    params: ParamIdSchema,
  },
  responses: new OpenApiResponse({
    successResponse: { schema: SuccessSchema, description: 'Package deleted' },
    codes: [401, 403, 404]
  }),
})