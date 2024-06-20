import { BadRequestSchema } from '@/schemas/BadRequestSchema';
import { ServerErrorSchema } from '@/schemas/ServerErrorSchema';
import { SuccessSchema } from '@/schemas/SuccessSchema';
import { UnauthorizedSchema } from '@/schemas/UnauthorizedSchema';
import { EmployeeRequestSchema } from '@/schemas/employees/EmployeeRequestSchema';
import { createRoute } from '@hono/zod-openapi';

export const CreateEmployeeRoute = createRoute({
  method: 'post',
  path: '/',
  tags: ['Employee'],
  security: [{
    cookieAuth: [],
  }],
  request: {
    body: {
      content: {
        "application/json": {
          schema: EmployeeRequestSchema
        }
      },
    }
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: SuccessSchema,
        },
      },
      description: 'Employee created',
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