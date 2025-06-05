import { createRoute } from '@hono/zod-openapi'
import { CityResponseListSchema } from './City.schema'
import { OpenApiResponse } from '@/utils/dtos/OpenApiResponse.dto'

export const CityRoute = createRoute({
  method: 'get',
  path: '/',
  tags: ['Location'],
  responses: new OpenApiResponse({
    successResponse: { schema: CityResponseListSchema, description: 'Retrieve list cities' },
  })
})