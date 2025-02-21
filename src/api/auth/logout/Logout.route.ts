import { createRoute, z } from '@hono/zod-openapi';
import { UnauthorizedSchema } from '@/lib/schemas/Unauthorized.schema';
import { BadRequestSchema } from '@/lib/schemas/BadRequest.schema';
import { ServerErrorSchema } from '@/lib/schemas/ServerError.schema';
import { LogoutResponseSchema } from './Logout.schema';

export const LogoutRoute = createRoute({
  method: 'delete',
  path: '/',
  tags: ['Auth'],
  responses: {
    200: {
      content: {
        'application/json': {
          schema: LogoutResponseSchema,
        }
      },
      description: 'Logout success',
    },
    401: {
      content: {
        'application/json': {
          schema: UnauthorizedSchema,
        },
      },
      description: 'Unauthorized',
    },
    422: {
      content: {
        'application/json': {
          schema: BadRequestSchema,
        },
      },
      description: 'Validation error',
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