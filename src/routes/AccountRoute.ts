import { ParamIdSchema } from '@/schemas/ParamIdSchema'
import { ResponseSchema } from '@/schemas/ResponseSchema'
import { AccountWithdrawSchema } from '@/schemas/accounts/AccountRequestSchema'
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
          schema: ResponseSchema(200, 'Berhasil mendapat daftar akun.', z.array(AccountResponseSchema)),
        },
      },
      description: 'Retrieve list accounts',
    },
    401: {
      content: {
        'application/json': {
          schema: ResponseSchema(401, 'Token tidak valid.'),
        },
      },
      description: 'Unauthorized',
    },
    500: {
      content: {
        'application/json': {
          schema: ResponseSchema(500, 'Terjadi kesalahan server.'),
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
          schema: ResponseSchema(200, 'Berhasil mendapat detail akun.', ExtendedAccountResponseSchema),
        },
      },
      description: 'Retrieve list categories',
    },
    401: {
      content: {
        'application/json': {
          schema: ResponseSchema(401, 'Token tidak valid.'),
        },
      },
      description: 'Unauthorized',
    },
    404: {
      content: {
        'application/json': {
          schema: ResponseSchema(404, 'Akun tidak ditemukan.'),
        },
      },
      description: 'Not Found',
    },
    500: {
      content: {
        'application/json': {
          schema: ResponseSchema(500, 'Terjadi kesalahan server.'),
        },
      },
      description: 'Internal error',
    },
  }
})

export const WithdrawAccountRoute = createRoute({
  method: 'patch',
  path: '/{id}/withdraw',
  tags,
  security: [{
    cookieAuth: [],
  }],
  request: {
    params: ParamIdSchema,
    body: {
      content: {
        'application/json': {
          schema: AccountWithdrawSchema
        }
      }
    }
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: ResponseSchema(200, 'Berhasil menarik saldo.', AccountResponseSchema),
        },
      },
      description: 'Retrieve list categories',
    },
    401: {
      content: {
        'application/json': {
          schema: ResponseSchema(401, 'Token tidak valid.'),
        },
      },
      description: 'Unauthorized',
    },
    404: {
      content: {
        'application/json': {
          schema: ResponseSchema(404, 'Akun tidak ditemukan.'),
        },
      },
      description: 'Not Found',
    },
    422: {
      content: {
        'application/json': {
          schema: ResponseSchema(422, 'Nominal tidak valid.'),
        },
      },
      description: 'Validation error',
    },
    500: {
      content: {
        'application/json': {
          schema: ResponseSchema(500, 'Terjadi kesalahan server.'),
        },
      },
      description: 'Internal error',
    },
  }
})