import { createRoute } from '@hono/zod-openapi';
import { UserParamSchema } from '../schemas/params/UserParamSchema';
import { UserResponseSchema } from '../schemas/responses/UserResponseSchema';
import { ValidationErrorSchema } from '../schemas/errors/ValidationErrorSchema';

const tags = ['User'];

export const UserRoute = createRoute({
  method: 'get',
  path: '/{id}',
  tags,
  security: [{
    cookieAuth: [],
  }],
  request: {
    params: UserParamSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: UserResponseSchema,
        },
      },
      description: 'Retrieve the user',
    },
    422: {
      content: {
        'application/json': {
          schema: ValidationErrorSchema,
        },
      },
      description: 'Validation error',
    },
  },
})