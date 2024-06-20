import { BadRequestSchema } from '@/schemas/BadRequestSchema';
import { NotFoundSchema } from '@/schemas/NotFoundSchema';
import { ParamIdSchema } from '@/schemas/ParamIdSchema';
import { ServerErrorSchema } from '@/schemas/ServerErrorSchema';
import { SuccessSchema } from '@/schemas/SuccessSchema';
import { UnauthorizedSchema } from '@/schemas/UnauthorizedSchema';
import { VehicleListSchema } from '@/schemas/vehicles/VehicleListSchema';
import { VehicleRequestSchema } from '@/schemas/vehicles/VehicleRequestSchema';
import { createRoute } from '@hono/zod-openapi';

export const DeleteVehicleRoute = createRoute({
  method: 'delete',
  path: '/{id}',
  tags: ['Vehicle'],
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