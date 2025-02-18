import { createRoute } from '@hono/zod-openapi'
import { ProvinceFilterSchema, ProvinceListSchema } from './Province.schema'
import { UnauthorizedSchema } from '@/lib/schemas/UnauthorizedSchema'
import { ServerErrorSchema } from '@/lib/schemas/ServerErrorSchema'

export const ProvinceRoute = createRoute({
  method: 'get',
  path: '/',
  tags: ['Location'],
  request: {
    query: ProvinceFilterSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: ProvinceListSchema,
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