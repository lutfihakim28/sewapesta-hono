import { OptionQuerySchema } from '@/schemas/OptionSchema'
import { ServerErrorSchema } from '@/schemas/ServerErrorSchema'
import { UnauthorizedSchema } from '@/schemas/UnauthorizedSchema'
import { OwnerOptionSchema } from '@/schemas/owners/OwnerOptionSchema'
import { createRoute } from '@hono/zod-openapi'

export const OptionOwnerRoute = createRoute({
  method: 'get',
  path: '/options',
  tags: ['Owner'],
  security: [{
    cookieAuth: [],
  }],
  request: {
    query: OptionQuerySchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: OwnerOptionSchema,
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