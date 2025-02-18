import { ServerErrorSchema } from '@/schemas/ServerErrorSchema'
import { SubdistrictFilterSchema } from '@/schemas/subdistricts/SubdistrictFilterSchema'
import { SubdistrictOptionSchema } from '@/schemas/subdistricts/SubdistrictOptionSchema'
import { UnauthorizedSchema } from '@/schemas/UnauthorizedSchema'
import { createRoute } from '@hono/zod-openapi'

export const SubdistrictRoute = createRoute({
  method: 'get',
  path: '/',
  tags: ['Subdistrict'],
  security: [{
    cookieAuth: [],
  }],
  request: {
    query: SubdistrictFilterSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: SubdistrictOptionSchema,
        },
      },
      description: 'Retrieve list Subdistricts\'s options',
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