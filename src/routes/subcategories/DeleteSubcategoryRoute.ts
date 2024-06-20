import { createRoute } from '@hono/zod-openapi'
import { ParamIdSchema } from '@/schemas/ParamIdSchema'
import { SuccessSchema } from '@/schemas/SuccessSchema'
import { UnauthorizedSchema } from '@/schemas/UnauthorizedSchema'
import { ServerErrorSchema } from '@/schemas/ServerErrorSchema'
import { NotFoundSchema } from '@/schemas/NotFoundSchema'

export const DeleteSubcategoryRoute = createRoute({
  method: 'delete',
  path: '/{id}',
  tags: ['Subcategory'],
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
          schema: SuccessSchema,
        },
      },
      description: 'Subcategory deleted',
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