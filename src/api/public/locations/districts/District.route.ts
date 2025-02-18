import { createRoute } from '@hono/zod-openapi'
import { UnauthorizedSchema } from '@/lib/schemas/UnauthorizedSchema'
import { ServerErrorSchema } from '@/lib/schemas/ServerErrorSchema'
import { DistrictFilterSchema, DistrictListSchema } from './District.schema'

export const DistrictRoute = createRoute({
  method: 'get',
  path: '/',
  tags: ['Location'],
  request: {
    query: DistrictFilterSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: DistrictListSchema,
        },
      },
      description: 'Retrieve list District\'s options',
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