import { createRoute } from '@hono/zod-openapi'
import { SuccessSchema } from '@/lib/schemas/Success.schema'
import { OpenApiResponse } from '@/lib/dtos/OpenApiResponse.dto'
import { ParamIdSchema } from '@/lib/schemas/ParamId.schema'
import { ProfileRequestSchema, UserChangePasswordSchema, UserCreateSchema, UserFilterSchema, UserResponseDataSchema, UserResponseListSchema, UserRoleUpdateSchema } from './User.schema'

const tag = 'User'

export const UserListRoute = createRoute({
  method: 'get',
  path: '/',
  tags: [tag],
  request: {
    query: UserFilterSchema,
  },
  responses: new OpenApiResponse({
    successResponse: { schema: UserResponseListSchema, description: 'Retrieve list users' },
    codes: [401, 403, 422],
  }),
})

export const UserDetailRoute = createRoute({
  method: 'get',
  path: '/{id}',
  tags: [tag],
  request: {
    params: ParamIdSchema,
  },
  responses: new OpenApiResponse({
    successResponse: { schema: UserResponseDataSchema, description: 'Retrieve detail user' },
    codes: [401, 403, 404],
  }),
})

export const UserCreateRoute = createRoute({
  method: 'post',
  path: '/',
  tags: [tag],
  request: {
    body: {
      content: {
        'application/json': {
          schema: UserCreateSchema
        }
      },
    }
  },
  responses: new OpenApiResponse({
    successResponse: { schema: UserResponseDataSchema, description: 'User created' },
    codes: [401, 403, 422],
  }),
})

export const UserUpdateRoute = createRoute({
  method: 'put',
  path: '/{id}/profiles',
  description: 'Update user\'s profile.',
  tags: [tag],
  request: {
    params: ParamIdSchema,
    body: {
      content: {
        'application/json': {
          schema: ProfileRequestSchema
        }
      },
    }
  },
  responses: new OpenApiResponse({
    successResponse: { schema: UserResponseDataSchema, description: 'User\'s profile is updated' },
    codes: [401, 403, 404, 422],
  }),
})

export const UserDeleteRoute = createRoute({
  method: 'delete',
  path: '/{id}',
  tags: [tag],
  request: {
    params: ParamIdSchema,
  },
  responses: new OpenApiResponse({
    successResponse: { schema: SuccessSchema, description: 'User deleted' },
    codes: [401, 403, 404]
  }),
})

export const UserChangePasswordRoute = createRoute({
  method: 'patch',
  path: '/{id}/passwords',
  description: 'Change user\'s password.',
  tags: [tag],
  request: {
    params: ParamIdSchema,
    body: {
      content: {
        'application/json': {
          schema: UserChangePasswordSchema
        }
      },
    }
  },
  responses: new OpenApiResponse({
    successResponse: { schema: UserResponseDataSchema, description: 'User\'s password updated' },
    codes: [401, 403, 404, 422],
  }),
})

export const UserRoleUpdateRoute = createRoute({
  method: 'patch',
  path: '/{id}/roles',
  description: 'Assign or unassign one role to user.',
  tags: [tag],
  request: {
    params: ParamIdSchema,
    body: {
      content: {
        'application/json': {
          schema: UserRoleUpdateSchema
        }
      },
    }
  },
  responses: new OpenApiResponse({
    successResponse: { schema: SuccessSchema, description: 'User\'s roles updated' },
    codes: [401, 403, 404, 422],
  }),
})