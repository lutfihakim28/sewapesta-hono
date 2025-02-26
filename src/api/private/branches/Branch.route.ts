import { createRoute } from '@hono/zod-openapi'
import { UnauthorizedSchema } from '@/lib/schemas/Unauthorized.schema'
import { ServerErrorSchema } from '@/lib/schemas/ServerError.schema'
import { BranchFilterSchema, BranchRequestSchema, BranchResponseDataSchema, BranchResponseExtendedDataSchema, BranchResponseListSchema } from './Branch.schema'
import { ParamIdSchema } from '@/schemas/ParamIdSchema'
import { NotFoundSchema } from '@/lib/schemas/NotFound.schema'
import { SuccessSchema } from '@/lib/schemas/Success.schema'

export const BranchListRoute = createRoute({
  method: 'get',
  path: '/',
  tags: ['Branch'],
  request: {
    query: BranchFilterSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: BranchResponseListSchema,
        },
      },
      description: 'Retrieve list Branches',
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

export const BranchDetailRoute = createRoute({
  method: 'get',
  path: '/{id}',
  tags: ['Branch'],
  request: {
    params: ParamIdSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: BranchResponseExtendedDataSchema,
        },
      },
      description: 'Retrieve detail branch',
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

export const BranchCreateRoute = createRoute({
  method: 'post',
  path: '/',
  tags: ['Branch'],
  request: {
    body: {
      content: {
        "application/json": {
          schema: BranchRequestSchema
        }
      },
    }
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: BranchResponseDataSchema,
        },
      },
      description: 'Branch created',
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

export const BranchUpdateRoute = createRoute({
  method: 'put',
  path: '/{id}',
  tags: ['Branch'],
  request: {
    params: ParamIdSchema,
    body: {
      content: {
        "application/json": {
          schema: BranchRequestSchema
        }
      },
    }
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: BranchResponseDataSchema,
        },
      },
      description: 'Branch updated',
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

export const BranchDeleteRoute = createRoute({
  method: 'delete',
  path: '/{id}',
  tags: ['Branch'],
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
      description: 'Retrieve detail branch',
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