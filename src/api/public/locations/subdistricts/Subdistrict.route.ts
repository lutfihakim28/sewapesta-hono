import { createRoute } from '@hono/zod-openapi'
import { UnauthorizedSchema } from '@/lib/schemas/UnauthorizedSchema'
import { ServerErrorSchema } from '@/lib/schemas/ServerErrorSchema'
import { SubdistrictFilterSchema, SubdistrictListSchema } from './Subdistrict.schema'

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
          schema: SubdistrictListSchema,
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