import { createRoute } from '@hono/zod-openapi'
import { SubcategoryRequestSchema } from '@/schemas/subcategories/SubcategoryRequestSchema'
import { SuccessSchema } from '@/schemas/SuccessSchema'
import { UnauthorizedSchema } from '@/schemas/UnauthorizedSchema'
import { BadRequestSchema } from '@/schemas/BadRequestSchema'
import { ServerErrorSchema } from '@/schemas/ServerErrorSchema'

export const CreateSubcategoryRoute = createRoute({
  method: 'post',
  path: '/',
  tags: ['Subcategory'],
  security: [{
    cookieAuth: [],
  }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: SubcategoryRequestSchema,
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
      description: 'Subcategory created',
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