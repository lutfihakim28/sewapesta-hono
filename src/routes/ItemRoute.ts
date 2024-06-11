import { messages } from '@/constatnts/messages'
import { validationMessages } from '@/constatnts/validationMessages'
import { ParamIdSchema } from '@/schemas/ParamIdSchema'
import { ResponseSchema } from '@/schemas/ResponseSchema'
import { ItemDetailSchema } from '@/schemas/items/ItemDetailSchema'
import { ItemFilterSchema } from '@/schemas/items/ItemFilterSchema'
import { ItemListSchema } from '@/schemas/items/ItemListSchema'
import { ItemRequestSchema } from '@/schemas/items/ItemRequestSchema'
import { createRoute, z } from '@hono/zod-openapi'

const tags = ['Item']

export const ListItemRoute = createRoute({
  method: 'get',
  path: '/',
  tags,
  security: [{
    cookieAuth: [],
  }],
  request: {
    query: ItemFilterSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: ResponseSchema(200, messages.successList('barang'), ItemListSchema, true),
        },
      },
      description: 'Retrieve list items',
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

export const DetailItemRoute = createRoute({
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
          schema: ResponseSchema(200, messages.successDetail('barang'), ItemDetailSchema),
        },
      },
      description: 'Retrieve detail item',
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
          schema: ResponseSchema(404, messages.errorNotFound('barang')),
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

export const CreateItemRoute = createRoute({
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
          schema: ItemRequestSchema,
        }
      }
    }
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: ResponseSchema(200, messages.successCreate('barang')),
        },
      },
      description: 'Item created',
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

export const UpdateItemRoute = createRoute({
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
          schema: ItemRequestSchema,
        }
      }
    }
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: ResponseSchema(200, messages.successUpdate('barang')),
        },
      },
      description: 'Item updated',
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
          schema: ResponseSchema(404, messages.errorNotFound('barang')),
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

export const DeleteItemRoute = createRoute({
  method: 'delete',
  path: '/{id}',
  tags,
  security: [{
    cookieAuth: [],
  }],
  request: {
    params: ParamIdSchema
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: ResponseSchema(200, messages.successDelete('barang')),
        },
      },
      description: 'Item deleted',
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
          schema: ResponseSchema(404, messages.errorNotFound('barang')),
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