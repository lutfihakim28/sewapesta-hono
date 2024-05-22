import { createRoute } from '@hono/zod-openapi';
import { ParamIdSchema } from '@/schemas/ParamIdSchema';
import { ResponseSchema } from '@/schemas/ResponseSchema';
import { UserResponseSchema } from '@/schemas/UserSchema';

const tags = ['User'];

export const UserRoute = createRoute({
  method: 'get',
  path: '/{id}',
  tags,
  security: [{
    cookieAuth: [],
  }],
  request: {
    params: ParamIdSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: ResponseSchema(200, 'Berhasil mendapatkan user', UserResponseSchema),
        },
      },
      description: 'Retrieve the user',
    },
    422: {
      content: {
        'application/json': {
          schema: ResponseSchema(422, 'Id tidak valid'),
        },
      },
      description: 'Validation error',
    },
  },
})