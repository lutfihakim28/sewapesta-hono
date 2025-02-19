import { createRoute } from '@hono/zod-openapi'
import { UnauthorizedSchema } from '@/lib/schemas/Unauthorized.schema'
import { ServerErrorSchema } from '@/lib/schemas/ServerError.schema'
import { BranchFilterSchema, BranchResponseListSchema } from './Branch.schema'

export const BranchRoute = createRoute({
  method: 'get',
  path: '/',
  tags: ['Branch'],
  request: {
    query: BranchFilterSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: BranchResponseListSchema,
        },
      },
      description: 'Retrieve list Branches',
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