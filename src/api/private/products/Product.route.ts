import { createRoute } from '@hono/zod-openapi'
import { SuccessSchema } from '@/utils/schemas/Success.schema'
import { OpenApiResponse } from '@/utils/dtos/OpenApiResponse.dto'
import { ParamIdSchema } from '@/utils/schemas/ParamId.schema'
import { ProductFilterSchema, ProductOptionResponseSchema, ProductRequestSchema, ProductResponseDataSchema, ProductResponseListSchema } from './Product.schema'

const tag = 'Product'

export const ProductListRoute = createRoute({
  method: 'get',
  path: '/',
  tags: [tag],
  request: {
    query: ProductFilterSchema,
  },
  responses: new OpenApiResponse({
    successResponse: { schema: ProductResponseListSchema, description: 'Get list products' },
    codes: [401, 403, 422],
  }),
})

export const ProductOptionRoute = createRoute({
  method: 'get',
  path: '/options',
  tags: [tag],
  responses: new OpenApiResponse({
    successResponse: { schema: ProductOptionResponseSchema, description: 'Retrieve list product options' },
    codes: [401, 403],
  }),
})

export const ProductDetailRoute = createRoute({
  method: 'get',
  path: '/{id}',
  tags: [tag],
  request: {
    params: ParamIdSchema,
  },
  responses: new OpenApiResponse({
    successResponse: { schema: ProductResponseDataSchema, description: 'Retrieve detail products' },
    codes: [401, 403, 404],
  }),
})

export const ProductCreateRoute = createRoute({
  method: 'post',
  path: '/',
  tags: [tag],
  request: {
    body: {
      content: {
        'application/json': {
          schema: ProductRequestSchema
        }
      },
    }
  },
  responses: new OpenApiResponse({
    successResponse: { schema: ProductResponseDataSchema, description: 'Product created' },
    codes: [401, 403, 422],
  }),
})

export const ProductUpdateRoute = createRoute({
  method: 'put',
  path: '/{id}',
  tags: [tag],
  request: {
    params: ParamIdSchema,
    body: {
      content: {
        'application/json': {
          schema: ProductRequestSchema
        }
      },
    }
  },
  responses: new OpenApiResponse({
    successResponse: { schema: ProductResponseDataSchema, description: 'Product updated' },
    codes: [401, 403, 404, 422],
  }),
})

export const ProductDeleteRoute = createRoute({
  method: 'delete',
  path: '/{id}',
  tags: [tag],
  request: {
    params: ParamIdSchema,
  },
  responses: new OpenApiResponse({
    successResponse: { schema: SuccessSchema, description: 'Product deleted' },
    codes: [401, 403, 404]
  }),
})