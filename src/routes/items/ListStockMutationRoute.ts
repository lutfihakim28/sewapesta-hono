import { ParamIdSchema } from '@/schemas/ParamIdSchema'
import { ServerErrorSchema } from '@/schemas/ServerErrorSchema'
import { StockMutationListSchema } from '@/schemas/stockMutations/StockMutationListSchema'
import { UnauthorizedSchema } from '@/schemas/UnauthorizedSchema'
import { createRoute } from '@hono/zod-openapi'

export const ListStockMutationRoute = createRoute({
  method: 'get',
  path: '/{id}/stock-mutations',
  tags: ['Item'],
  security: [{
    cookieAuth: [],
  }],
  request: {
    params: ParamIdSchema
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: StockMutationListSchema,
        },
      },
      description: 'Retrieve list stock mutations',
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