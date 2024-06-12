import { BadRequestSchema } from '@/schemas/BadRequestSchema';
import { NotFoundSchema } from '@/schemas/NotFoundSchema';
import { ParamIdSchema } from '@/schemas/ParamIdSchema';
import { ServerErrorSchema } from '@/schemas/ServerErrorSchema';
import { SuccessSchema } from '@/schemas/SuccessSchema';
import { UnauthorizedSchema } from '@/schemas/UnauthorizedSchema';
import { EmployeeDetailSchema } from '@/schemas/employees/EmployeeDetailSchema';
import { EmployeeFilterSchema } from '@/schemas/employees/EmployeeFilterSchema';
import { EmployeeListSchema } from '@/schemas/employees/EmployeeListSchema';
import { EmployeeRequestSchema } from '@/schemas/employees/EmployeeRequestSchema';
import { createRoute, z } from '@hono/zod-openapi';

const tags = ['Employee']

export const ListEmployeeRoute = createRoute({
  method: 'get',
  path: '/',
  tags,
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

export const DetailEmployeeRoute = createRoute({
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
          schema: EmployeeDetailSchema,
        },
      },
      description: 'Retrieve detail employee',
    },
    401: {
      content: {
        'application/json': {
          schema: UnauthorizedSchema,
        },
      },
      description: 'Unauthorized',
    },
    404: {
      content: {
        'application/json': {
          schema: NotFoundSchema,
        },
      },
      description: 'Not Found',
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

export const CreateEmployeeRoute = createRoute({
  method: 'post',
  path: '/',
  tags,
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

export const UpdateEmployeeRoute = createRoute({
  method: 'put',
  path: '/{id}',
  tags,
  security: [{
    cookieAuth: [],
  }],
  request: {
    params: ParamIdSchema,
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
      description: 'Employee updated',
    },
    401: {
      content: {
        'application/json': {
          schema: UnauthorizedSchema,
        },
      },
      description: 'Unauthorized',
    },
    404: {
      content: {
        'application/json': {
          schema: NotFoundSchema,
        },
      },
      description: 'Not Found',
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

export const DeleteEmployeeRoute = createRoute({
  method: 'delete',
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
          schema: SuccessSchema,
        },
      },
      description: 'Employee deleted',
    },
    401: {
      content: {
        'application/json': {
          schema: UnauthorizedSchema,
        },
      },
      description: 'Unauthorized',
    },
    404: {
      content: {
        'application/json': {
          schema: NotFoundSchema,
        },
      },
      description: 'Not Found',
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