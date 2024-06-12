import { messages } from '@/constatnts/messages';
import { validationMessages } from '@/constatnts/validationMessages';
import { BadRequestSchema } from '@/schemas/BadRequestSchema';
import { NotFoundSchema } from '@/schemas/NotFoundSchema';
import { ParamIdSchema } from '@/schemas/ParamIdSchema';
import { ServerErrorSchema } from '@/schemas/ServerErrorSchema';
import { SuccessSchema } from '@/schemas/SuccessSchema';
import { UnauthorizedSchema } from '@/schemas/UnauthorizedSchema';
import { VehicleListSchema } from '@/schemas/vehicles/VehicleListSchema';
import { VehicleRequestSchema } from '@/schemas/vehicles/VehicleRequestSchema';
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
          schema: VehicleListSchema
        }
      },
      description: 'Retrieve list vehicles',
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
          schema: SuccessSchema,
        },
      },
      description: 'Vehicle created',
    },
    401: {
      content: {
        'application/json': {
          schema: UnauthorizedSchema,
        },
      },
      description: 'Unauthorized',
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
          schema: SuccessSchema,
        },
      },
      description: 'Vehicle updated',
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
          schema: SuccessSchema,
        },
      },
      description: 'Vehicle deleted',
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