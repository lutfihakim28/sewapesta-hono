import { BadRequestSchema } from '@/schemas/BadRequestSchema'
import { ServerErrorSchema } from '@/schemas/ServerErrorSchema'
import { SuccessSchema } from '@/schemas/SuccessSchema'
import { UnauthorizedSchema } from '@/schemas/UnauthorizedSchema'
import { OwnerRequestSchema } from '@/schemas/owners/OwnerRequestSchema'
import { createRoute } from '@hono/zod-openapi'

export const CreateOwnerRoute = createRoute({
  method: 'post',
  path: '/',
  tags: ['Owner'],
  security: [{
    cookieAuth: [],
  }],
  request: {
    body: {
      content: {
        "application/json": {
          schema: OwnerRequestSchema,
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
      description: 'Owner created',
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