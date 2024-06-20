import { createRoute } from '@hono/zod-openapi'
import { UnauthorizedSchema } from '@/schemas/UnauthorizedSchema'
import { ServerErrorSchema } from '@/schemas/ServerErrorSchema'
import { UnitListSchema } from '@/schemas/units/UnitListSchema'

export const ListUnitRoute = createRoute({
  method: 'get',
  path: '/',
  tags: ['Unit'],
  security: [{
    cookieAuth: [],
  }],
  responses: {
    200: {
      content: {
        'application/json': {
          schema: UnitListSchema,
        },
      },
      description: 'Retrieve list units',
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