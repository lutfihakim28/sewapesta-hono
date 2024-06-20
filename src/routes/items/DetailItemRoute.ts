import { NotFoundSchema } from '@/schemas/NotFoundSchema'
import { ParamIdSchema } from '@/schemas/ParamIdSchema'
import { ServerErrorSchema } from '@/schemas/ServerErrorSchema'
import { UnauthorizedSchema } from '@/schemas/UnauthorizedSchema'
import { ItemDetailSchema } from '@/schemas/items/ItemDetailSchema'
import { createRoute } from '@hono/zod-openapi'

export const DetailItemRoute = createRoute({
  method: 'get',
  path: '/{id}',
  tags: ['Item'],
  security: [{
    cookieAuth: [],
  }],
  request: {
    params: ParamIdSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: ItemDetailSchema,
        },
      },
      description: 'Retrieve detail item',
    },
    401: {
      content: {
        'application/json': {
          schema: UnauthorizedSchema,
        },
      },
      description: 'Unauthorized',
    },
    404: {
      content: {
        'application/json': {
          schema: NotFoundSchema,
        },
      },
      description: 'Not Found',
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