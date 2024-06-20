import { BadRequestSchema } from '@/schemas/BadRequestSchema'
import { ServerErrorSchema } from '@/schemas/ServerErrorSchema'
import { SuccessSchema } from '@/schemas/SuccessSchema'
import { UnauthorizedSchema } from '@/schemas/UnauthorizedSchema'
import { AccountCreateSchema } from '@/schemas/accounts/AccountRequestSchema'
import { createRoute } from '@hono/zod-openapi'

export const CreateAccountRoute = createRoute({
  method: 'post',
  path: '/',
  tags: ['Account'],
  security: [{
    cookieAuth: [],
  }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: AccountCreateSchema
        }
      }
    }
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: SuccessSchema,
        },
      },
      description: 'Create account success',
    },
    401: {
      content: {
        'application/json': {
          schema: UnauthorizedSchema,
        },
      },
      description: 'Unauthorized',
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
})