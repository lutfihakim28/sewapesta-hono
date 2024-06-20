import { NotFoundSchema } from '@/schemas/NotFoundSchema'
import { ParamIdSchema } from '@/schemas/ParamIdSchema'
import { ServerErrorSchema } from '@/schemas/ServerErrorSchema'
import { UnauthorizedSchema } from '@/schemas/UnauthorizedSchema'
import { AccountDetailSchema } from '@/schemas/accounts/AccountDetailSchema'
import { createRoute } from '@hono/zod-openapi'

export const DetailAccountRoute = createRoute({
  method: 'get',
  path: '/{id}',
  tags: ['Account'],
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
          schema: AccountDetailSchema,
        },
      },
      description: 'Retrieve detail account',
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