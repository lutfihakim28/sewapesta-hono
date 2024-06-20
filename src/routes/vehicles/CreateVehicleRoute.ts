import { BadRequestSchema } from '@/schemas/BadRequestSchema';
import { ServerErrorSchema } from '@/schemas/ServerErrorSchema';
import { SuccessSchema } from '@/schemas/SuccessSchema';
import { UnauthorizedSchema } from '@/schemas/UnauthorizedSchema';
import { VehicleRequestSchema } from '@/schemas/vehicles/VehicleRequestSchema';
import { createRoute } from '@hono/zod-openapi';

export const CreateVehicleRoute = createRoute({
  method: 'post',
  path: '/',
  tags: ['Vehicle'],
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