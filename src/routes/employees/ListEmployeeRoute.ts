import { ServerErrorSchema } from '@/schemas/ServerErrorSchema';
import { UnauthorizedSchema } from '@/schemas/UnauthorizedSchema';
import { EmployeeFilterSchema } from '@/schemas/employees/EmployeeFilterSchema';
import { EmployeeListSchema } from '@/schemas/employees/EmployeeListSchema';
import { createRoute } from '@hono/zod-openapi';

export const ListEmployeeRoute = createRoute({
  method: 'get',
  path: '/',
  tags: ['Employee'],
  security: [{
    cookieAuth: [],
  }],
  request: {
    query: EmployeeFilterSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: EmployeeListSchema,
        },
      },
      description: 'Retrieve list employees',
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