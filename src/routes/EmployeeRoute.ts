import { ParamIdSchema } from '@/schemas/ParamIdSchema';
import { ResponseSchema } from '@/schemas/ResponseSchema';
import { EmployeeRequestSchema } from '@/schemas/employees/EmployeeRequestSchema';
import { EmployeeResponseSchema } from '@/schemas/employees/EmployeeResponseSchema';
import { ExtendedEmployeeResponseSchema } from '@/schemas/employees/ExtendedEmployeeResponseSchema';
import { createRoute, z } from '@hono/zod-openapi';

const tags = ['Employee']

export const ListEmployeeRoute = createRoute({
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
          schema: ResponseSchema(200, 'Berhasil mendapatkan daftar karyawan.', z.array(ExtendedEmployeeResponseSchema)),
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
          schema: ResponseSchema(200, 'Berhasil mendapatkan detail karyawan.', ExtendedEmployeeResponseSchema),
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
          schema: ResponseSchema(404, 'Karyawan tidak ditemukan.'),
        },
      },
      description: 'Not Found',
    },
    422: {
      content: {
        'application/json': {
          schema: ResponseSchema(422, 'Nama tidak valid.'),
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
          schema: ResponseSchema(200, 'Berhasil menambah karyawan.', EmployeeResponseSchema),
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
    422: {
      content: {
        'application/json': {
          schema: ResponseSchema(422, 'Nama tidak valid.'),
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

export const UpdateEmployeeRoute = createRoute({
  method: 'post',
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
          schema: ResponseSchema(200, 'Berhasil mengubah karyawan.', EmployeeResponseSchema),
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
          schema: ResponseSchema(404, 'Karyawan tidak ditemukan.'),
        },
      },
      description: 'Not Found',
    },
    422: {
      content: {
        'application/json': {
          schema: ResponseSchema(422, 'Nama tidak valid.'),
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
          schema: ResponseSchema(200, 'Berhasil menghapus karyawan.'),
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
          schema: ResponseSchema(404, 'Karyawan tidak ditemukan.'),
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