import { createRoute } from '@hono/zod-openapi';
import { ResponseSchema } from '@/schemas/ResponseSchema';
import { LoginRequestSchema, LoginResponseSchema, LogoutResponseSchema } from '../schemas/AuthSchema';
import { messages } from '@/constatnts/messages';
import { validationMessages } from '@/constatnts/validationMessages';

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
          schema: ResponseSchema(200, messages.successLogin, LoginResponseSchema)
        }
      },
      description: 'Login success',
    },
    401: {
      content: {
        'application/json': {
          schema: ResponseSchema(401, messages.unauthorized),
        },
      },
      description: 'Unauthorized',
    },
    422: {
      content: {
        'application/json': {
          schema: ResponseSchema(422, validationMessages.minLength('Kata sandi', 8)),
        },
      },
      description: 'Validation error',
    },
    500: {
      content: {
        'application/json': {
          schema: ResponseSchema(500, messages.errorServer),
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
          schema: ResponseSchema(200, messages.successLogout, LogoutResponseSchema),
        }
      },
      description: 'Logout success',
    },
    401: {
      content: {
        'application/json': {
          schema: ResponseSchema(401, messages.unauthorized),
        },
      },
      description: 'Unauthorized',
    },
    500: {
      content: {
        'application/json': {
          schema: ResponseSchema(500, messages.errorServer),
        },
      },
      description: 'Internal error',
    },
  }
})