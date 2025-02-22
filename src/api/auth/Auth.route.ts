import { createRoute, z } from '@hono/zod-openapi';
import { UnauthorizedSchema } from '@/lib/schemas/Unauthorized.schema';
import { BadRequestSchema } from '@/lib/schemas/BadRequest.schema';
import { ServerErrorSchema } from '@/lib/schemas/ServerError.schema';
import { LoginRequestSchema, LoginResponseSchema, RefreshRequestSchema } from './Auth.schema';
import { SuccessSchema } from '@/lib/schemas/Success.schema';
import { UserCreateSchema } from '../private/users/User.schema';

export const RegisterRoute = createRoute({
  method: 'post',
  path: '/register',
  tags: ['Auth'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: UserCreateSchema
        }
      }
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: SuccessSchema,
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
  responses: {
    200: {
      content: {
        'application/json': {
          schema: LoginResponseSchema,
        }
      },
      description: 'Refresh success',
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

export const LogoutRoute = createRoute({
  method: 'delete',
  path: '/logout',
  tags: ['Auth'],
  responses: {
    200: {
      content: {
        'application/json': {
          schema: SuccessSchema,
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