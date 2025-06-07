import { createRoute } from '@hono/zod-openapi'
import { CityFilterSchema, CityResponseListSchema } from './City.schema'
import { OpenApiResponse } from '@/utils/dtos/OpenApiResponse.dto'

export const CityRoute = createRoute({
  method: 'get',
  path: '/',
  tags: ['Location'],
  request: {
    query: CityFilterSchema
  },
  responses: new OpenApiResponse({
    successResponse: { schema: CityResponseListSchema, description: 'Retrieve list cities' },
  })
})