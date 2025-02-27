import { createRoute, z } from '@hono/zod-openapi';
import { LoginRequestSchema, LoginResponseSchema, RefreshRequestSchema } from './Auth.schema';
import { SuccessSchema } from '@/lib/schemas/Success.schema';
import { OpenApiResponse } from '@/lib/dtos/OpenApiResponse.dto';

export const LoginRoute = createRoute({
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
  responses: new OpenApiResponse({
    successResponse: { schema: LoginResponseSchema, description: 'Login success' },
    codes: [422],
  }),
})

export const RefreshRoute = createRoute({
  method: 'put',
  path: '/refresh',
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
  responses: new OpenApiResponse({
    successResponse: { schema: LoginResponseSchema, description: 'Refresh success' },
    codes: [422],
  }),
})

export const LogoutRoute = createRoute({
  method: 'delete',
  path: '/logout',
  tags: ['Auth'],
  responses: new OpenApiResponse({
    successResponse: { schema: SuccessSchema, description: 'Logout success' },
    codes: [422],
  }),
})