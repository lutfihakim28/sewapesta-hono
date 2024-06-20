import { createRoute } from '@hono/zod-openapi'
import { UnitRequestSchema } from '@/schemas/units/UnitRequestSchema'
import { UnauthorizedSchema } from '@/schemas/UnauthorizedSchema'
import { ServerErrorSchema } from '@/schemas/ServerErrorSchema'
import { SuccessSchema } from '@/schemas/SuccessSchema'
import { BadRequestSchema } from '@/schemas/BadRequestSchema'

export const CreateUnitRoute = createRoute({
  method: 'post',
  path: '/',
  tags: ['Unit'],
  security: [{
    cookieAuth: [],
  }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: UnitRequestSchema,
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
      description: 'Unit created',
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