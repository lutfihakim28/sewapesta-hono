import { createRoute } from '@hono/zod-openapi';
import { ResponseSchema } from '@/schemas/ResponseSchema';
import { LoginRequestSchema, LoginResponseSchema, LogoutResponseSchema } from '../schemas/AuthSchema';

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
          schema: ResponseSchema(200, 'Berhasil login', LoginResponseSchema)
        }
      },
      description: 'Login success',
    },
    401: {
      content: {
        'application/json': {
          schema: ResponseSchema(401, 'Token tidak valid.'),
        },
      },
      description: 'Unauthorized',
    },
    422: {
      content: {
        'application/json': {
          schema: ResponseSchema(422, 'Password minimal 8 karakter.'),
        },
      },
      description: 'Validation error',
    },
    500: {
      content: {
        'application/json': {
          schema: ResponseSchema(500, 'Terjadi kesalahan server'),
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
          schema: ResponseSchema(200, 'Berhasil logout.', LogoutResponseSchema),
        }
      },
      description: 'Logout success',
    },
    401: {
      content: {
        'application/json': {
          schema: ResponseSchema(401, 'Token tidak valid.'),
        },
      },
      description: 'Unauthorized',
    },
    500: {
      content: {
        'application/json': {
          schema: ResponseSchema(500, 'Terjadi kesalahan server'),
        },
      },
      description: 'Internal error',
    },
  }
})