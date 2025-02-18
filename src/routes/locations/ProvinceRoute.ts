import { ProvinceFilterSchema } from '@/schemas/provinces/ProvinceFilterSchema'
import { ProvinceOptionSchema } from '@/schemas/provinces/ProvinceOptionSchema'
import { ServerErrorSchema } from '@/schemas/ServerErrorSchema'
import { UnauthorizedSchema } from '@/schemas/UnauthorizedSchema'
import { createRoute } from '@hono/zod-openapi'

export const ProvinceRoute = createRoute({
  method: 'get',
  path: '/',
  tags: ['Province'],
  security: [{
    cookieAuth: [],
  }],
  request: {
    query: ProvinceFilterSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: ProvinceOptionSchema,
        },
      },
      description: 'Retrieve list Provinces\'s options',
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