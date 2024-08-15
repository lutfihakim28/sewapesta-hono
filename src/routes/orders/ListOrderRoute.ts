import { OrderFilterSchema } from '@/schemas/orders/OrderFilterSchema'
import { OrderListSchema } from '@/schemas/orders/OrderListSchema'
import { ServerErrorSchema } from '@/schemas/ServerErrorSchema'
import { UnauthorizedSchema } from '@/schemas/UnauthorizedSchema'
import { createRoute } from '@hono/zod-openapi'

export const ListOrderRoute = createRoute({
  method: 'get',
  path: '/',
  tags: ['Order'],
  security: [{
    cookieAuth: [],
  }],
  request: {
    query: OrderFilterSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: OrderListSchema,
        },
      },
      description: 'Retrieve list orders',
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