import { ProductFilterSchema } from '@/schemas/products/ProductFilterSchema'
import { ProductListSchema } from '@/schemas/products/ProductListSchema'
import { ServerErrorSchema } from '@/schemas/ServerErrorSchema'
import { UnauthorizedSchema } from '@/schemas/UnauthorizedSchema'
import { createRoute } from '@hono/zod-openapi'

export const ListProductRoute = createRoute({
  method: 'get',
  path: '/',
  tags: ['Product'],
  security: [{
    cookieAuth: [],
  }],
  request: {
    query: ProductFilterSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: ProductListSchema,
        },
      },
      description: 'Retrieve list items',
    },
    401: {
      content: {
        'application/json': {
          schema: UnauthorizedSchema,
        },
      },
      description: 'Unauthorized',
    },
    500: {
      content: {
        'application/json': {
          schema: ServerErrorSchema,
        },
      },
      description: 'Internal error',
    },
  }
})