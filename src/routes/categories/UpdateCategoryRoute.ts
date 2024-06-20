import { createRoute } from '@hono/zod-openapi'
import { ParamIdSchema } from '@/schemas/ParamIdSchema'
import { CategoryRequestSchema } from '@/schemas/categories/CategoryRequestSchema'
import { UnauthorizedSchema } from '@/schemas/UnauthorizedSchema'
import { ServerErrorSchema } from '@/schemas/ServerErrorSchema'
import { SuccessSchema } from '@/schemas/SuccessSchema'
import { BadRequestSchema } from '@/schemas/BadRequestSchema'
import { NotFoundSchema } from '@/schemas/NotFoundSchema'

export const UpdateCategoryRoute = createRoute({
  method: 'put',
  path: '/{id}',
  tags: ['Category'],
  security: [{
    cookieAuth: [],
  }],
  request: {
    params: ParamIdSchema,
    body: {
      content: {
        'application/json': {
          schema: CategoryRequestSchema
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
      description: 'Category updated',
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
})