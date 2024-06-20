import { ServerErrorSchema } from '@/schemas/ServerErrorSchema'
import { UnauthorizedSchema } from '@/schemas/UnauthorizedSchema'
import { AccountFilterSchema } from '@/schemas/accounts/AccountFilterSchema'
import { AccountListSchema } from '@/schemas/accounts/AccountListSchema'
import { createRoute } from '@hono/zod-openapi'

export const ListAccountRoute = createRoute({
  method: 'get',
  path: '/',
  tags: ['Account'],
  security: [{
    cookieAuth: [],
  }],
  request: {
    query: AccountFilterSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: AccountListSchema,
        },
      },
      description: 'Retrieve list accounts',
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