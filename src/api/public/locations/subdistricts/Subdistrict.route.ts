import { createRoute } from '@hono/zod-openapi'
import { UnauthorizedSchema } from '@/lib/schemas/Unauthorized.schema'
import { ServerErrorSchema } from '@/lib/schemas/ServerError.schema'
import { SubdistrictFilterSchema, SubdistrictResponseListSchema } from './Subdistrict.schema'

export const SubdistrictRoute = createRoute({
  method: 'get',
  path: '/',
  tags: ['Location'],
  request: {
    query: SubdistrictFilterSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: SubdistrictResponseListSchema,
        },
      },
      description: 'Retrieve list Subdistrict\'s options',
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