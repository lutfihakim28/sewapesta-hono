import { BadRequestSchema } from '@/schemas/BadRequestSchema'
import { NotFoundSchema } from '@/schemas/NotFoundSchema'
import { ParamIdSchema } from '@/schemas/ParamIdSchema'
import { ServerErrorSchema } from '@/schemas/ServerErrorSchema'
import { UnauthorizedSchema } from '@/schemas/UnauthorizedSchema'
import { AccountMutationFilterSchema } from '@/schemas/accountMutations/AccountMutationFilterSchema'
import { AccountMutationListSchema } from '@/schemas/accountMutations/AccountMutationListSchema'
import { createRoute } from '@hono/zod-openapi'

export const AccountMutationRoute = createRoute({
  method: 'get',
  path: '/{id}/mutations',
  tags: ['Account'],
  security: [{
    cookieAuth: [],
  }],
  request: {
    params: ParamIdSchema,
    query: AccountMutationFilterSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: AccountMutationListSchema,
        },
      },
      description: 'Retrieve list account mutations',
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
    422: {
      content: {
        'application/json': {
          schema: BadRequestSchema,
        },
      },
      description: 'Validation error',
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
});