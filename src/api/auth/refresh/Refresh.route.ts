import { createRoute, z } from '@hono/zod-openapi';
import { UnauthorizedSchema } from '@/lib/schemas/Unauthorized.schema';
import { BadRequestSchema } from '@/lib/schemas/BadRequest.schema';
import { ServerErrorSchema } from '@/lib/schemas/ServerError.schema';
import { RefreshRequestSchema } from './Refresh.schema';
import { LoginResponseSchema } from '../login/Login.schema';

export const RefreshRoute = createRoute({
  method: 'put',
  path: '/',
  tags: ['Auth'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: RefreshRequestSchema
        }
      }
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: LoginResponseSchema,
        }
      },
      description: 'Refresh success',
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