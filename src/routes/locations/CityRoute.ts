import { CityFilterSchema } from '@/schemas/cities/CityFilterSchema'
import { CityOptionSchema } from '@/schemas/cities/CityOptionSchema'
import { ServerErrorSchema } from '@/schemas/ServerErrorSchema'
import { UnauthorizedSchema } from '@/schemas/UnauthorizedSchema'
import { createRoute } from '@hono/zod-openapi'

export const CityRoute = createRoute({
  method: 'get',
  path: '/',
  tags: ['City'],
  security: [{
    cookieAuth: [],
  }],
  request: {
    query: CityFilterSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: CityOptionSchema,
        },
      },
      description: 'Retrieve list Citys\'s options',
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