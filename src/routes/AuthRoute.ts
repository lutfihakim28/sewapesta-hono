import { createRoute, z } from '@hono/zod-openapi';
import { LoginRequestSchema, LoginResponseSchema } from '../schemas/AuthSchema';
import { messages } from '@/constatnts/messages';
import { UnauthorizedSchema } from '@/schemas/UnauthorizedSchema';
import { BadRequestSchema } from '@/schemas/BadRequestSchema';
import { ServerErrorSchema } from '@/schemas/ServerErrorSchema';

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
          schema: z.object({
            code: z.number().openapi({ example: 200 }),
            messages: z.string().openapi({ example: messages.successLogin }),
            data: LoginResponseSchema,
          })
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
          schema: z.object({
            code: z.number().openapi({ example: 200 }),
            messages: z.string().openapi({ example: messages.successLogout }),
          }),
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