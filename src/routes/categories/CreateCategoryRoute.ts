import { createRoute } from '@hono/zod-openapi'
import { CategoryRequestSchema } from '@/schemas/categories/CategoryRequestSchema'
import { UnauthorizedSchema } from '@/schemas/UnauthorizedSchema'
import { ServerErrorSchema } from '@/schemas/ServerErrorSchema'
import { SuccessSchema } from '@/schemas/SuccessSchema'
import { BadRequestSchema } from '@/schemas/BadRequestSchema'

export const CreateCategoryRoute = createRoute({
  method: 'post',
  path: '/',
  tags: ['Category'],
  security: [{
    cookieAuth: [],
  }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: CategoryRequestSchema,
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
      description: 'Category created',
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