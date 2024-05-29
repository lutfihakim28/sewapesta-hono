import { createRoute, z } from '@hono/zod-openapi'
import { ParamIdSchema } from '@/schemas/ParamIdSchema'
import { ResponseSchema } from '@/schemas/ResponseSchema'
import { SubcategoryRequestSchema } from '@/schemas/subcategories/SubcategoryRequestSchema'
import { SubcategoryResponseSchema } from '@/schemas/subcategories/SubcategoryResponseSchema'

const tags = ['Subcategory']

// POST
export const CreateSubcategoryRoute = createRoute({
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
          schema: SubcategoryRequestSchema,
        }
      }
    }
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: ResponseSchema(200, 'Berhasil menyimpan kategori.', SubcategoryResponseSchema),
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

// PUT
export const UpdateSubcategoryRoute = createRoute({
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
          schema: SubcategoryRequestSchema
        }
      }
    }
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: ResponseSchema(200, 'Berhasil mengubah kategori.', SubcategoryResponseSchema),
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
export const DeleteSubcategoryRoute = createRoute({
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