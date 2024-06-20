import { createRoute, z } from '@hono/zod-openapi';
import { messages } from '@/constatnts/messages';
import { UnauthorizedSchema } from '@/schemas/UnauthorizedSchema';
import { ServerErrorSchema } from '@/schemas/ServerErrorSchema';

export const AuthLogoutRoute = createRoute({
  method: 'delete',
  path: '/logout',
  tags: ['Auth'],
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