import { createRoute } from '@hono/zod-openapi'
import { BranchFilterSchema, BranchRequestSchema, BranchResponseDataSchema, BranchResponseExtendedDataSchema, BranchResponseListSchema } from './Branch.schema'
import { SuccessSchema } from '@/lib/schemas/Success.schema'
import { OpenApiResponse } from '@/lib/dtos/OpenApiResponse.dto'
import { ParamIdSchema } from '@/lib/schemas/ParamId.schema'

export const BranchListRoute = createRoute({
  method: 'get',
  path: '/',
  tags: ['Branch'],
  request: {
    query: BranchFilterSchema,
  },
  responses: new OpenApiResponse({
    successResponse: { schema: BranchResponseListSchema, description: 'Retrieve list branches' },
    codes: [401, 403],
  }),
})

export const BranchDetailRoute = createRoute({
  method: 'get',
  path: '/{id}',
  tags: ['Branch'],
  request: {
    params: ParamIdSchema,
  },
  responses: new OpenApiResponse({
    successResponse: { schema: BranchResponseExtendedDataSchema, description: 'Retrieve detail branch' },
    codes: [401, 403, 404],
  }),
})

export const BranchCreateRoute = createRoute({
  method: 'post',
  path: '/',
  tags: ['Branch'],
  request: {
    body: {
      content: {
        "application/json": {
          schema: BranchRequestSchema
        }
      },
    }
  },
  responses: new OpenApiResponse({
    successResponse: { schema: BranchResponseDataSchema, description: 'Branch created' },
    codes: [401, 403, 422],
  }),
})

export const BranchUpdateRoute = createRoute({
  method: 'put',
  path: '/{id}',
  tags: ['Branch'],
  request: {
    params: ParamIdSchema,
    body: {
      content: {
        "application/json": {
          schema: BranchRequestSchema
        }
      },
    }
  },
  responses: new OpenApiResponse({
    successResponse: { schema: BranchResponseDataSchema, description: 'Branch updated' },
    codes: [401, 403, 404, 422],
  }),
})

export const BranchDeleteRoute = createRoute({
  method: 'delete',
  path: '/{id}',
  tags: ['Branch'],
  request: {
    params: ParamIdSchema,
  },
  responses: new OpenApiResponse({
    successResponse: { schema: SuccessSchema, description: 'Branch deleted' },
    codes: [401, 403, 404]
  }),
})