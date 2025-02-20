import { createRoute, z } from '@hono/zod-openapi';
import { LoginRequestSchema, LoginResponseSchema } from './Login.schema';
import { messages } from '@/lib/constants/messages';
import { UnauthorizedSchema } from '@/lib/schemas/Unauthorized.schema';
import { BadRequestSchema } from '@/lib/schemas/BadRequest.schema';
import { ServerErrorSchema } from '@/lib/schemas/ServerError.schema';

export const AuthLoginRoute = createRoute({
  method: 'post',
  path: '/login',
  tags: ['Auth'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: LoginRequestSchema
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
      description: 'Login success',
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