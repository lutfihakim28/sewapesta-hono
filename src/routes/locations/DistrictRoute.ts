import { DistrictFilterSchema } from '@/schemas/districts/DistrictFilterSchema'
import { DistrictOptionSchema } from '@/schemas/districts/DistrictOptionSchema'
import { ServerErrorSchema } from '@/schemas/ServerErrorSchema'
import { UnauthorizedSchema } from '@/schemas/UnauthorizedSchema'
import { createRoute } from '@hono/zod-openapi'

export const DistrictRoute = createRoute({
  method: 'get',
  path: '/',
  tags: ['District'],
  security: [{
    cookieAuth: [],
  }],
  request: {
    query: DistrictFilterSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: DistrictOptionSchema,
        },
      },
      description: 'Retrieve list Districts\'s options',
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