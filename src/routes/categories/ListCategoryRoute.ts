import { createRoute } from '@hono/zod-openapi'
import { CategoryListSchema } from '@/schemas/categories/CategoryListSchema'
import { UnauthorizedSchema } from '@/schemas/UnauthorizedSchema'
import { ServerErrorSchema } from '@/schemas/ServerErrorSchema'

export const ListCategoryRoute = createRoute({
  method: 'get',
  path: '/',
  tags: ['Category'],
  security: [{
    cookieAuth: [],
  }],
  responses: {
    200: {
      content: {
        'application/json': {
          schema: CategoryListSchema,
        },
      },
      description: 'Retrieve list categoriesTable',
    },
    401: {
      content: {
        'application/json': {
          schema: UnauthorizedSchema,
        },
      },
      description: 'Unauthorized',
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