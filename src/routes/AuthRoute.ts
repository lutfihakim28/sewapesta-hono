import { createRoute } from '@hono/zod-openapi';
import { LoginResponseSchema } from '../schemas/responses/LoginResponseSchema';
import { ValidationErrorSchema } from '../schemas/errors/ValidationErrorSchema';
import { LoginRequestSchema } from '../schemas/requests/LoginRequestSchema';
import { LogoutResponseSchema } from '../schemas/responses/LogoutResponseSchema';
import { UnauthorizedErrorSchema } from '../schemas/errors/UnauthorizedErrorSchema';
import { InternalErrorSchema } from '../schemas/errors/InternalErrorSchema';

const tags = ['Auth'];

export const AuthLoginRoute = createRoute({
  method: 'post',
  path: '/login',
  tags,
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
          schema: LoginResponseSchema
        }
      },
      description: 'Login success',
    },
    401: {
      content: {
        'application/json': {
          schema: UnauthorizedErrorSchema,
        },
      },
      description: 'Unauthorized',
    },
    422: {
      content: {
        'application/json': {
          schema: ValidationErrorSchema,
        },
      },
      description: 'Validation error',
    },
    500: {
      content: {
        'application/json': {
          schema: InternalErrorSchema,
        },
      },
      description: 'Internal error',
    },
  }
})

export const AuthLogoutRoute = createRoute({
  method: 'delete',
  path: '/logout',
  tags,
  security: [
    {
      cookieAuth: [],
    }
  ],
  responses: {
    200: {
      content: {
        'application/json': {
          schema: LogoutResponseSchema
        }
      },
      description: 'Logout success',
    },
    401: {
      content: {
        'application/json': {
          schema: UnauthorizedErrorSchema,
        },
      },
      description: 'Unauthorized',
    },
    500: {
      content: {
        'application/json': {
          schema: InternalErrorSchema,
        },
      },
      description: 'Internal error',
    },
  }
})