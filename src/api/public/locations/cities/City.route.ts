import { createRoute } from '@hono/zod-openapi'
import { UnauthorizedSchema } from '@/lib/schemas/Unauthorized.schema'
import { ServerErrorSchema } from '@/lib/schemas/ServerError.schema'
import { CityFilterSchema, CityResponseListSchema } from './City.schema'

export const CityRoute = createRoute({
  method: 'get',
  path: '/',
  tags: ['Location'],
  request: {
    query: CityFilterSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: CityResponseListSchema,
        },
      },
      description: 'Retrieve list City\'s options',
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