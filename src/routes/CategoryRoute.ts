import { createRoute, z } from '@hono/zod-openapi'
import { ParamIdSchema } from '@/schemas/ParamIdSchema'
import { ResponseSchema } from '@/schemas/ResponseSchema'
import { CategoryRequestSchema } from '@/schemas/categories/CategoryRequestSchema'
import { ExtendedCategoryResponseSchema } from '@/schemas/categories/ExtendedCategoryResponseSchema'
import { CategoryResponseSchema } from '@/schemas/categories/CategoryResponseSchema'
import { messages } from '@/constatnts/messages'
import { validationMessages } from '@/constatnts/validationMessages'

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
          schema: ResponseSchema(200, messages.successList('kategori'), z.array(ExtendedCategoryResponseSchema)),
        },
      },
      description: 'Retrieve list categories',
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
          schema: ResponseSchema(200, messages.successCreate('kategori'), CategoryResponseSchema),
        },
      },
      description: 'Category created',
    },
    401: {
      content: {
        'application/json': {
          schema: ResponseSchema(401, messages.unauthorized),
        },
      },
      description: 'Unauthorized',
    },
    422: {
      content: {
        'application/json': {
          schema: ResponseSchema(422, validationMessages.required('Nama')),
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
          schema: ResponseSchema(200, messages.successUpdate('kategori'), ExtendedCategoryResponseSchema),
        },
      },
      description: 'Category updated',
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
          schema: ResponseSchema(404, messages.errorNotFound('kategori')),
        },
      },
      description: 'Not Found',
    },
    422: {
      content: {
        'application/json': {
          schema: ResponseSchema(422, validationMessages.required('Nama')),
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
      description: 'Category deleted',
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
          schema: ResponseSchema(404, messages.errorNotFound('kategori')),
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
          schema: ResponseSchema(500, messages.errorServer),
        },
      },
      description: 'Internal error',
    },
  }
})