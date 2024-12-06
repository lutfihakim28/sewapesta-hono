import { ListItemProductSchema } from '@/schemas/items/ItemProductSchema'
import { ParamIdSchema } from '@/schemas/ParamIdSchema'
import { ServerErrorSchema } from '@/schemas/ServerErrorSchema'
import { UnauthorizedSchema } from '@/schemas/UnauthorizedSchema'
import { createRoute } from '@hono/zod-openapi'

export const ListItemProductRoute = createRoute({
  method: 'get',
  path: '/{id}/products',
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
          schema: ListItemProductSchema,
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