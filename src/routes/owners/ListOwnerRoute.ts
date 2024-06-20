import { ServerErrorSchema } from '@/schemas/ServerErrorSchema'
import { UnauthorizedSchema } from '@/schemas/UnauthorizedSchema'
import { OwnerFilterSchema } from '@/schemas/owners/OwnerFilterScheme'
import { OwnerListSchema } from '@/schemas/owners/OwnerListSchema'
import { createRoute } from '@hono/zod-openapi'

export const ListOwnerRoute = createRoute({
  method: 'get',
  path: '/',
  tags: ['Owner'],
  security: [{
    cookieAuth: [],
  }],
  request: {
    query: OwnerFilterSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: OwnerListSchema,
        },
      },
      description: 'Retrieve list owners',
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