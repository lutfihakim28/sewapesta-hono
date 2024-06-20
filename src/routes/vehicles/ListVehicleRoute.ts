import { ServerErrorSchema } from '@/schemas/ServerErrorSchema';
import { UnauthorizedSchema } from '@/schemas/UnauthorizedSchema';
import { VehicleListSchema } from '@/schemas/vehicles/VehicleListSchema';
import { createRoute } from '@hono/zod-openapi';

export const ListVehicleRoute = createRoute({
  method: 'get',
  path: '/',
  tags: ['Vehicle'],
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