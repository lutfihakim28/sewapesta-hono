import { createRoute } from '@hono/zod-openapi'
import { SuccessSchema } from '@/lib/schemas/Success.schema'
import { OpenApiResponse } from '@/lib/dtos/OpenApiResponse.dto'
import { CategoryFilterSchema, CategoryRequestSchema, CategoryResponseSchema } from './Category.schema'
import { ParamIdSchema } from '@/lib/schemas/ParamId.schema'

export const CategoryListRoute = createRoute({
  method: 'get',
  path: '/',
  tags: ['Category'],
  request: {
    query: CategoryFilterSchema,
  },
  responses: new OpenApiResponse({
    successResponse: { schema: CategoryResponseSchema, description: 'Retrieve list categories' },
    codes: [401, 403],
  }),
})

export const CategoryCreateRoute = createRoute({
  method: 'post',
  path: '/',
  tags: ['Category'],
  request: {
    body: {
      content: {
        "application/json": {
          schema: CategoryRequestSchema
        }
      },
    }
  },
  responses: new OpenApiResponse({
    successResponse: { schema: SuccessSchema, description: 'Category created' },
    codes: [401, 403, 422],
  }),
})

export const CategoryUpdateRoute = createRoute({
  method: 'put',
  path: '/{id}',
  tags: ['Category'],
  request: {
    params: ParamIdSchema,
    body: {
      content: {
        "application/json": {
          schema: CategoryRequestSchema
        }
      },
    }
  },
  responses: new OpenApiResponse({
    successResponse: { schema: SuccessSchema, description: 'Category updated' },
    codes: [401, 403, 404, 422],
  }),
})

export const CategoryDeleteRoute = createRoute({
  method: 'delete',
  path: '/{id}',
  tags: ['Category'],
  request: {
    params: ParamIdSchema,
  },
  responses: new OpenApiResponse({
    successResponse: { schema: SuccessSchema, description: 'Category deleted' },
    codes: [401, 403, 404]
  }),
})