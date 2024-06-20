import { createRoute } from '@hono/zod-openapi'
import { ParamIdSchema } from '@/schemas/ParamIdSchema'
import { SubcategoryRequestSchema } from '@/schemas/subcategories/SubcategoryRequestSchema'
import { SuccessSchema } from '@/schemas/SuccessSchema'
import { UnauthorizedSchema } from '@/schemas/UnauthorizedSchema'
import { BadRequestSchema } from '@/schemas/BadRequestSchema'
import { ServerErrorSchema } from '@/schemas/ServerErrorSchema'
import { NotFoundSchema } from '@/schemas/NotFoundSchema'

export const UpdateSubcategoryRoute = createRoute({
  method: 'put',
  path: '/{id}',
  tags: ['Subcategory'],
  security: [{
    cookieAuth: [],
  }],
  request: {
    params: ParamIdSchema,
    body: {
      content: {
        'application/json': {
          schema: SubcategoryRequestSchema
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
      description: 'Subcategory updated',
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