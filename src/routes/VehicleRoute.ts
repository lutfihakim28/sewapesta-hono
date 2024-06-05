import { messages } from '@/constatnts/messages';
import { validationMessages } from '@/constatnts/validationMessages';
import { ParamIdSchema } from '@/schemas/ParamIdSchema';
import { ResponseSchema } from '@/schemas/ResponseSchema';
import { VehicleRequestSchema } from '@/schemas/vehicles/VehicleRequestSchema';
import { VehicleResponseSchema } from '@/schemas/vehicles/VehicleResponseSchema';
import { createRoute, z } from '@hono/zod-openapi';

const tags = ['Vehicle'];

export const ListVehicleRoute = createRoute({
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
          schema: ResponseSchema(200, messages.successList('kendaraan'), z.array(VehicleResponseSchema))
        }
      },
      description: 'Retrieve list vehicles',
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

export const DetailVehicleRoute = createRoute({
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
          schema: ResponseSchema(200, messages.successDetail('kendaraan'), VehicleResponseSchema),
        },
      },
      description: 'Retrieve detail vehicle',
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
          schema: ResponseSchema(404, messages.errorNotFound('kendaraan')),
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

export const CreateVehicleRoute = createRoute({
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
          schema: VehicleRequestSchema,
        }
      }
    }
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: ResponseSchema(200, messages.successCreate('kendaraan'), VehicleResponseSchema),
        },
      },
      description: 'Vehicle created',
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

export const UpdateVehicleRoute = createRoute({
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
          schema: VehicleRequestSchema,
        }
      }
    }
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: ResponseSchema(200, messages.successUpdate('kendaraan'), VehicleResponseSchema),
        },
      },
      description: 'Vehicle updated',
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
          schema: ResponseSchema(404, messages.errorNotFound('kendaraan')),
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

export const DeleteVehicleRoute = createRoute({
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
          schema: ResponseSchema(200, messages.successDelete('kendaraan')),
        },
      },
      description: 'Vehicle deleted',
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
          schema: ResponseSchema(404, messages.errorNotFound('kendaraan')),
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