import { BadRequestSchema } from '@/schemas/BadRequestSchema'
import { ServerErrorSchema } from '@/schemas/ServerErrorSchema'
import { SuccessSchema } from '@/schemas/SuccessSchema'
import { UnauthorizedSchema } from '@/schemas/UnauthorizedSchema'
import { ItemCreateSchema } from '@/schemas/items/ItemRequestSchema'
import { createRoute } from '@hono/zod-openapi'

export const CreateItemRoute = createRoute({
  method: 'post',
  path: '/',
  tags: ['Item'],
  security: [{
    cookieAuth: [],
  }],
  request: {
    body: {
      content: {
        "multipart/form-data": {
          schema: ItemCreateSchema,
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
      description: 'Item created',
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