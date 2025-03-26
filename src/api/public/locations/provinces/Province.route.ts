import { createRoute } from '@hono/zod-openapi'
import { ProvinceFilterSchema, ProvinceResponseListSchema } from './Province.schema'
import { OpenApiResponse } from '@/lib/dtos/OpenApiResponse.dto'

export const ProvinceRoute = createRoute({
  method: 'get',
  path: '/',
  tags: ['Location'],
  request: {
    query: ProvinceFilterSchema,
  },
  responses: new OpenApiResponse({
    successResponse: { schema: ProvinceResponseListSchema, description: 'Retrieve list provinces' },
  })
})