import { createRoute } from '@hono/zod-openapi'
import { ProvinceFilterSchema, ProvinceResponseListSchema } from './Province.schema'
import { UnauthorizedSchema } from '@/lib/schemas/Unauthorized.schema'
import { ServerErrorSchema } from '@/lib/schemas/ServerError.schema'

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
          schema: ProvinceResponseListSchema,
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