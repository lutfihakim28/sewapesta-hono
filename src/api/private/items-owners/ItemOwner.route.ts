import { createRoute, z } from '@hono/zod-openapi'
import { SuccessSchema } from '@/lib/schemas/Success.schema'
import { OpenApiResponse } from '@/lib/dtos/OpenApiResponse.dto'
import { ParamIdSchema } from '@/lib/schemas/ParamId.schema'
import { ItemOwnerFilterSchema, ItemOwnerRequestSchema, ItemOwnerResponseDataSchema, ItemOwnerResponseListSchema, ItemOwnerUpdateRequestSchema } from './ItemOwner.schema'

const tag = 'Item Owner'

export const ItemOwnerListRoute = createRoute({
  method: 'get',
  path: '/',
  tags: [tag],
  request: {
    query: ItemOwnerFilterSchema,
  },
  responses: new OpenApiResponse({
    successResponse: { schema: ItemOwnerResponseListSchema, description: 'Retrieve list item owners' },
    codes: [401, 403, 422],
  }),
})

export const ItemOwnerCreateRoute = createRoute({
  method: 'post',
  path: '/',
  tags: [tag],
  request: {
    body: {
      content: {
        'application/json': {
          schema: ItemOwnerRequestSchema
        }
      },
    }
  },
  responses: new OpenApiResponse({
    successResponse: { schema: ItemOwnerResponseDataSchema, description: 'Item owner created' },
    codes: [401, 403, 422],
  }),
})

export const ItemOwnerUpdateRoute = createRoute({
  method: 'put',
  path: '/{id}',
  tags: [tag],
  request: {
    params: ParamIdSchema,
    body: {
      content: {
        'application/json': {
          schema: ItemOwnerUpdateRequestSchema
        }
      },
    }
  },
  responses: new OpenApiResponse({
    successResponse: { schema: ItemOwnerResponseDataSchema, description: 'Item owner updated' },
    codes: [401, 403, 404, 422],
  }),
})

export const ItemOwnerDeleteRoute = createRoute({
  method: 'delete',
  path: '/{id}',
  tags: [tag],
  request: {
    params: ParamIdSchema,
  },
  responses: new OpenApiResponse({
    successResponse: { schema: SuccessSchema, description: 'Item owner deleted' },
    codes: [401, 403, 404]
  }),
})