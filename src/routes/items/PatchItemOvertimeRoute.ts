import { BadRequestSchema } from '@/schemas/BadRequestSchema';
import { ItemPatchOvertimeSchema } from '@/schemas/items/ItemPatchOvertimeSchema';
import { NotFoundSchema } from '@/schemas/NotFoundSchema';
import { ParamIdSchema } from '@/schemas/ParamIdSchema';
import { ServerErrorSchema } from '@/schemas/ServerErrorSchema';
import { SuccessSchema } from '@/schemas/SuccessSchema';
import { UnauthorizedSchema } from '@/schemas/UnauthorizedSchema';
import { createRoute } from '@hono/zod-openapi';

export const PatchItemOvertimeRoute = createRoute({
  method: 'patch',
  path: '/{id}/overtime',
  tags: ['Item'],
  security: [{
    cookieAuth: [],
  }],
  request: {
    params: ParamIdSchema,
    body: {
      content: {
        "application/json": {
          schema: ItemPatchOvertimeSchema,
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
      description: 'Item updated',
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