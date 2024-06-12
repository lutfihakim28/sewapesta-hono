import { BadRequestSchema } from '@/schemas/BadRequestSchema'
import { NotFoundSchema } from '@/schemas/NotFoundSchema'
import { ParamIdSchema } from '@/schemas/ParamIdSchema'
import { ServerErrorSchema } from '@/schemas/ServerErrorSchema'
import { SuccessSchema } from '@/schemas/SuccessSchema'
import { UnauthorizedSchema } from '@/schemas/UnauthorizedSchema'
import { AccountMutationFilterSchema } from '@/schemas/accountMutations/AccountMutationFilterSchema'
import { AccountMutationListSchema } from '@/schemas/accountMutations/AccountMutationListSchema'
import { AccountMutationRequestSchema } from '@/schemas/accountMutations/AccountMutationRequestSchema'
import { AccountDetailSchema } from '@/schemas/accounts/AccountDetailSchema'
import { AccountFilterSchema } from '@/schemas/accounts/AccountFilterSchema'
import { AccountListSchema } from '@/schemas/accounts/AccountListSchema'
import { createRoute, z } from '@hono/zod-openapi'

const tags = ['Account']

export const ListAccountRoute = createRoute({
  method: 'get',
  path: '/',
  tags,
  security: [{
    cookieAuth: [],
  }],
  request: {
    query: AccountFilterSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: AccountListSchema,
        },
      },
      description: 'Retrieve list accounts',
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

export const DetailAccountRoute = createRoute({
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
          schema: AccountDetailSchema,
        },
      },
      description: 'Retrieve detail account',
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

export const AccountMutationRoute = createRoute({
  method: 'get',
  path: '/{id}/mutations',
  tags,
  security: [{
    cookieAuth: [],
  }],
  request: {
    params: ParamIdSchema,
    query: AccountMutationFilterSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: AccountMutationListSchema,
        },
      },
      description: 'Retrieve list account mutations',
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
});

export const DepositAccountRoute = createRoute({
  method: 'patch',
  path: '/{id}/deposits',
  tags,
  security: [{
    cookieAuth: [],
  }],
  request: {
    params: ParamIdSchema,
    body: {
      content: {
        'application/json': {
          schema: AccountMutationRequestSchema
        }
      }
    }
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: SuccessSchema,
        },
      },
      description: 'Deposit success',
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

export const WithdrawAccountRoute = createRoute({
  method: 'patch',
  path: '/{id}/withdraws',
  tags,
  security: [{
    cookieAuth: [],
  }],
  request: {
    params: ParamIdSchema,
    body: {
      content: {
        'application/json': {
          schema: AccountMutationRequestSchema
        }
      }
    }
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: SuccessSchema,
        },
      },
      description: 'Withdraw success',
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