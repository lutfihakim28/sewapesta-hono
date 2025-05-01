import { createRoute, z } from '@hono/zod-openapi'
import { SuccessSchema } from '@/lib/schemas/Success.schema'
import { OpenApiResponse } from '@/lib/dtos/OpenApiResponse.dto'
import { ParamIdSchema } from '@/lib/schemas/ParamId.schema'
import { ProductItemFilterSchema, ProductItemRequestSchema, ProductItemResponseDataSchema, ProductItemResponseListSchema } from './ProductItem.schema'

const tag = 'Product Item'

export const ProductItemListRoute = createRoute({
  method: 'get',
  path: '/',
  tags: [tag],
  request: {
    query: ProductItemFilterSchema,
  },
  responses: new OpenApiResponse({
    successResponse: { schema: ProductItemResponseListSchema, description: 'Retrieve list product items' },
    codes: [401, 403, 422],
  }),
})

export const ProductItemCreateRoute = createRoute({
  method: 'post',
  path: '/',
  tags: [tag],
  request: {
    body: {
      content: {
        'application/json': {
          schema: ProductItemRequestSchema
        }
      },
    }
  },
  responses: new OpenApiResponse({
    successResponse: { schema: ProductItemResponseDataSchema, description: 'ProductItem created' },
    codes: [401, 403, 422],
  }),
})

export const ProductItemUpdateRoute = createRoute({
  method: 'put',
  path: '/',
  tags: [tag],
  request: {
    body: {
      content: {
        'application/json': {
          schema: ProductItemRequestSchema
        }
      },
    }
  },
  responses: new OpenApiResponse({
    successResponse: { schema: ProductItemResponseDataSchema, description: 'ProductItem updated' },
    codes: [401, 403, 404, 422],
  }),
})

export const ProductItemDeleteRoute = createRoute({
  method: 'delete',
  path: '/{productId}/{itemId}',
  tags: [tag],
  request: {
    params: z.object({
      itemId: z
        .string()
        .openapi({
          param: {
            name: 'itemId',
            in: 'path',
          },
          example: '1',
        }),
      productId: z
        .string()
        .openapi({
          param: {
            name: 'productId',
            in: 'path',
          },
          example: '1',
        }),
    }),
  },
  responses: new OpenApiResponse({
    successResponse: { schema: SuccessSchema, description: 'ProductItem deleted' },
    codes: [401, 403, 404]
  }),
})