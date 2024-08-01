import { PackageListSchema } from '@/schemas/packages/PackageListSchema'
import { ServerErrorSchema } from '@/schemas/ServerErrorSchema'
import { UnauthorizedSchema } from '@/schemas/UnauthorizedSchema'
import { createRoute } from '@hono/zod-openapi'

export const ListPackageRoute = createRoute({
  method: 'get',
  path: '/',
  tags: ['Item'],
  security: [{
    cookieAuth: [],
  }],
  // request: {
  //   query: ItemFilterSchema,
  // },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: PackageListSchema,
        },
      },
      description: 'Retrieve list items',
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