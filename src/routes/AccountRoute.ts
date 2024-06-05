import { messages } from '@/constatnts/messages'
import { validationMessages } from '@/constatnts/validationMessages'
import { ParamIdSchema } from '@/schemas/ParamIdSchema'
import { ResponseSchema } from '@/schemas/ResponseSchema'
import { AccountMutationFilterSchema } from '@/schemas/accountMutations/AccountMutationFilterSchema'
import { AccountMutationRequestSchema } from '@/schemas/accountMutations/AccountMutationRequestSchema'
import { AccountMutationResponseSchema } from '@/schemas/accountMutations/AccountMutationResponseSchema'
import { AccountResponseSchema } from '@/schemas/accounts/AccountResponseSchema'
import { ExtendedAccountResponseSchema } from '@/schemas/accounts/ExtendedAccountResponseSchema'
import { createRoute, z } from '@hono/zod-openapi'

const tags = ['Account']

export const ListAccountRoute = createRoute({
  method: 'get',
  path: '/',
  tags,
  security: [{
    cookieAuth: [],
  }],
  responses: {
    200: {
      content: {
        'application/json': {
          schema: ResponseSchema(200, messages.successList('akun'), z.array(AccountResponseSchema)),
        },
      },
      description: 'Retrieve list accounts',
    },
    401: {
      content: {
        'application/json': {
          schema: ResponseSchema(401, messages.unauthorized),
        },
      },
      description: 'Unauthorized',
    },
    500: {
      content: {
        'application/json': {
          schema: ResponseSchema(500, messages.errorServer),
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
          schema: ResponseSchema(200, messages.successDetail('akun'), ExtendedAccountResponseSchema),
        },
      },
      description: 'Retrieve detail account',
    },
    401: {
      content: {
        'application/json': {
          schema: ResponseSchema(401, messages.unauthorized),
        },
      },
      description: 'Unauthorized',
    },
    404: {
      content: {
        'application/json': {
          schema: ResponseSchema(404, messages.errorNotFound('akun')),
        },
      },
      description: 'Not Found',
    },
    500: {
      content: {
        'application/json': {
          schema: ResponseSchema(500, messages.errorServer),
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
          schema: ResponseSchema(200, messages.successList('mutasi akun'), z.array(AccountMutationResponseSchema), true),
        },
      },
      description: 'Retrieve list account mutations',
    },
    401: {
      content: {
        'application/json': {
          schema: ResponseSchema(401, messages.unauthorized),
        },
      },
      description: 'Unauthorized',
    },
    404: {
      content: {
        'application/json': {
          schema: ResponseSchema(404, messages.errorNotFound('akun')),
        },
      },
      description: 'Not Found',
    },
    422: {
      content: {
        'application/json': {
          schema: ResponseSchema(422, validationMessages.requiredNumber('Page')),
        },
      },
      description: 'Validation error',
    },
    500: {
      content: {
        'application/json': {
          schema: ResponseSchema(500, messages.errorServer),
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
          schema: ResponseSchema(200, messages.successDeposit),
        },
      },
      description: 'Deposit success',
    },
    401: {
      content: {
        'application/json': {
          schema: ResponseSchema(401, messages.unauthorized),
        },
      },
      description: 'Unauthorized',
    },
    404: {
      content: {
        'application/json': {
          schema: ResponseSchema(404, messages.errorNotFound('akun')),
        },
      },
      description: 'Not Found',
    },
    422: {
      content: {
        'application/json': {
          schema: ResponseSchema(422, validationMessages.requiredNumber('Nominal')),
        },
      },
      description: 'Validation error',
    },
    500: {
      content: {
        'application/json': {
          schema: ResponseSchema(500, messages.errorServer),
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
          schema: ResponseSchema(200, messages.successWithdraw),
        },
      },
      description: 'Withdraw success',
    },
    401: {
      content: {
        'application/json': {
          schema: ResponseSchema(401, messages.unauthorized),
        },
      },
      description: 'Unauthorized',
    },
    404: {
      content: {
        'application/json': {
          schema: ResponseSchema(404, messages.errorNotFound('akun')),
        },
      },
      description: 'Not Found',
    },
    422: {
      content: {
        'application/json': {
          schema: ResponseSchema(422, validationMessages.requiredNumber('Nominal')),
        },
      },
      description: 'Validation error',
    },
    500: {
      content: {
        'application/json': {
          schema: ResponseSchema(500, messages.errorServer),
        },
      },
      description: 'Internal error',
    },
  }
})