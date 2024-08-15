import { OrderedProductListSchema } from '@/schemas/orderedProducts/OrderedProductListSchema'
import { ParamIdSchema } from '@/schemas/ParamIdSchema'
import { ProductEmployeeAssignmentListSchema } from '@/schemas/productEmployeeAssignments/ProductEmployeeAssignmentListSchema'
import { ServerErrorSchema } from '@/schemas/ServerErrorSchema'
import { UnauthorizedSchema } from '@/schemas/UnauthorizedSchema'
import { createRoute } from '@hono/zod-openapi'

export const ListAssignedEmployeeRoute = createRoute({
  method: 'get',
  path: '/{id}/assigned-employees',
  tags: ['Order'],
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
          schema: ProductEmployeeAssignmentListSchema,
        },
      },
      description: 'Retrieve detail order',
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