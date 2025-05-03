import { createRoute } from '@hono/zod-openapi'
import { SuccessSchema } from '@/lib/schemas/Success.schema'
import { OpenApiResponse } from '@/lib/dtos/OpenApiResponse.dto'
import { ParamIdSchema } from '@/lib/schemas/ParamId.schema'
import { ProductFilterSchema, ProductRequestSchema, ProductResponseDataSchema, ProductResponseListSchema } from './Product.schema'

const tag = 'Product'

export const ProductListRoute = createRoute({
  method: 'get',
  path: '/',
  tags: [tag],
  request: {
    query: ProductFilterSchema,
  },
  responses: new OpenApiResponse({
    successResponse: { schema: ProductResponseListSchema, description: 'Retrieve list branches' },
    codes: [401, 403, 422],
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