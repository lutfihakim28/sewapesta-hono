import { createRoute } from '@hono/zod-openapi'
import { ProvinceResponseListSchema } from './Province.schema'
import { OpenApiResponse } from '@/utils/dtos/OpenApiResponse.dto'

export const ProvinceRoute = createRoute({
  method: 'get',
  path: '/',
  tags: ['Location'],
  responses: new OpenApiResponse({
    successResponse: { schema: ProvinceResponseListSchema, description: 'Retrieve list provinces' },
  })
})