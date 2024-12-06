import { ItemOrderStatQuerySchema } from '@/schemas/items/ItemOrderStatQuerySchema'
import { ListItemOrderStatSchema } from '@/schemas/items/ItemOrderStatSchema'
import { ParamIdSchema } from '@/schemas/ParamIdSchema'
import { ServerErrorSchema } from '@/schemas/ServerErrorSchema'
import { UnauthorizedSchema } from '@/schemas/UnauthorizedSchema'
import { createRoute } from '@hono/zod-openapi'

export const ListItemOrderStatRoute = createRoute({
  method: 'get',
  path: '/{id}/order-stats',
  tags: ['Item'],
  security: [{
    cookieAuth: [],
  }],
  request: {
    params: ParamIdSchema,
    query: ItemOrderStatQuerySchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: ListItemOrderStatSchema,
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