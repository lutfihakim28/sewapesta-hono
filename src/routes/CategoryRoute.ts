import { createRoute, z } from '@hono/zod-openapi'
import { ParamIdSchema } from '@/schemas/ParamIdSchema'
import { ResponseSchema } from '@/schemas/ResponseSchema'
import { CategoryRequestSchema } from '@/schemas/categories/CategoryRequestSchema'
import { ExtendedCategoryResponseSchema } from '@/schemas/categories/ExtendedCategoryResponseSchema'
import { CategoryResponseSchema } from '@/schemas/categories/CategoryResponseSchema'

const tags = ['Category']

// GET All
export const ListCategoryRoute = createRoute({
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
          schema: ResponseSchema(200, 'Berhasil mendapat daftar kategori.', z.array(ExtendedCategoryResponseSchema)),
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

// POST
export const CreateCategoryRoute = createRoute({
  method: 'post',
  path: '/',
  tags,
  security: [{
    cookieAuth: [],
  }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: CategoryRequestSchema,
        }
      }
    }
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: ResponseSchema(200, 'Berhasil menyimpan kategori.', CategoryResponseSchema),
        },
      },
      description: 'Create category',
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
          schema: ResponseSchema(401, 'Nama tidak valid.'),
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

// PUT
export const UpdateCategoryRoute = createRoute({
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
        'application/json': {
          schema: CategoryRequestSchema
        }
      }
    }
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: ResponseSchema(200, 'Berhasil mengubah kategori.', ExtendedCategoryResponseSchema),
        },
      },
      description: 'Update category',
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
          schema: ResponseSchema(404, 'Kategori tidak ditemukan.'),
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

// Delete
export const DeleteCategoryRoute = createRoute({
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
          schema: ResponseSchema(200, 'Berhasil menghapus kategori'),
        },
      },
      description: 'Retrieve the user',
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
          schema: ResponseSchema(404, 'Kategori tidak ditemukan.'),
        },
      },
      description: 'Not Found',
    },
    422: {
      content: {
        'application/json': {
          schema: ResponseSchema(422, 'Id tidak valid.'),
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