import { ServerErrorSchema } from '@/schemas/ServerErrorSchema'
import { UnauthorizedSchema } from '@/schemas/UnauthorizedSchema'
import { ItemFilterSchema } from '@/schemas/items/ItemFilterSchema'
import { ItemListSchema } from '@/schemas/items/ItemListSchema'
import { createRoute } from '@hono/zod-openapi'

export const ListItemRoute = createRoute({
  method: 'get',
  path: '/',
  tags: ['Item'],
  security: [{
    cookieAuth: [],
  }],
  request: {
    query: ItemFilterSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: ItemListSchema,
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