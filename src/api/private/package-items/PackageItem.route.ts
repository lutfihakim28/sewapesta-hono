import { createRoute } from '@hono/zod-openapi'
import { SuccessSchema } from '@/utils/schemas/Success.schema'
import { OpenApiResponse } from '@/utils/dtos/OpenApiResponse.dto'
import { ParamIdSchema } from '@/utils/schemas/ParamId.schema'
import { PackageItemFilterSchema, PackageItemRequestSchema, PackageItemResponseDataSchema, PackageItemResponseListSchema } from './PackageItem.schema'

const tag = 'Package Item'

export const PackageItemListRoute = createRoute({
  method: 'get',
  path: '/',
  tags: [tag],
  request: {
    query: PackageItemFilterSchema,
  },
  responses: new OpenApiResponse({
    successResponse: { schema: PackageItemResponseListSchema, description: 'Get list package items' },
    codes: [401, 403, 422],
  }),
})

export const PackageItemDetailRoute = createRoute({
  method: 'get',
  path: '/{id}',
  tags: [tag],
  request: {
    params: ParamIdSchema,
  },
  responses: new OpenApiResponse({
    successResponse: { schema: PackageItemResponseDataSchema, description: 'Get detail package item' },
    codes: [401, 403, 404],
  }),
})

export const PackageItemCreateRoute = createRoute({
  method: 'post',
  path: '/',
  tags: [tag],
  request: {
    body: {
      content: {
        'application/json': {
          schema: PackageItemRequestSchema
        }
      },
    }
  },
  responses: new OpenApiResponse({
    successResponse: { schema: PackageItemResponseDataSchema, description: 'Package item created' },
    codes: [401, 403, 422],
  }),
})

export const PackageItemUpdateRoute = createRoute({
  method: 'put',
  path: '/{id}',
  tags: [tag],
  request: {
    params: ParamIdSchema,
    body: {
      content: {
        'application/json': {
          schema: PackageItemRequestSchema
        }
      },
    }
  },
  responses: new OpenApiResponse({
    successResponse: { schema: PackageItemResponseDataSchema, description: 'Package item updated' },
    codes: [401, 403, 404, 422],
  }),
})

export const PackageItemDeleteRoute = createRoute({
  method: 'delete',
  path: '/{id}',
  tags: [tag],
  request: {
    params: ParamIdSchema,
  },
  responses: new OpenApiResponse({
    successResponse: { schema: SuccessSchema, description: 'Package item deleted' },
    codes: [401, 403, 404]
  }),
})