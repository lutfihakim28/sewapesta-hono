import { createRoute } from '@hono/zod-openapi'
import { SuccessSchema } from '@/utils/schemas/Success.schema'
import { OpenApiResponse } from '@/utils/dtos/OpenApiResponse.dto'
import { CategoryFilterSchema, CategoryOptionResponseSchema, CategoryRequestSchema, CategoryResponseSchema } from './Category.schema'
import { ParamIdSchema } from '@/utils/schemas/ParamId.schema'
import { UniqueCheckSchema } from '@/utils/schemas/UniqueCheck.schema'

const tag = 'Category'

export const CategoryListRoute = createRoute({
  method: 'get',
  path: '/',
  tags: [tag],
  request: {
    query: CategoryFilterSchema,
  },
  responses: new OpenApiResponse({
    successResponse: { schema: CategoryResponseSchema, description: 'Retrieve list categories' },
    codes: [401, 403],
  }),
})

export const CategoryOptionRoute = createRoute({
  method: 'get',
  path: '/options',
  tags: [tag],
  responses: new OpenApiResponse({
    successResponse: { schema: CategoryOptionResponseSchema, description: 'Retrieve list category options' },
    codes: [401, 403],
  }),
})

export const CategoryCreateRoute = createRoute({
  method: 'post',
  path: '/',
  tags: [tag],
  request: {
    body: {
      content: {
        'application/json': {
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
  tags: [tag],
  request: {
    params: ParamIdSchema,
    body: {
      content: {
        'application/json': {
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
  tags: [tag],
  request: {
    params: ParamIdSchema,
  },
  responses: new OpenApiResponse({
    successResponse: { schema: SuccessSchema, description: 'Category deleted' },
    codes: [401, 403, 404]
  }),
})

export const CategoryCheckRoute = createRoute({
  method: 'get',
  path: '/check-uniques',
  tags: [tag],
  request: {
    query: UniqueCheckSchema,
  },
  responses: new OpenApiResponse({
    successResponse: { schema: SuccessSchema, description: 'Category\'s name is available' },
    codes: [401, 403, 404, 422],
  }),
})