import { createRoute } from '@hono/zod-openapi'
import { DistrictResponseListSchema } from './District.schema'
import { OpenApiResponse } from '@/utils/dtos/OpenApiResponse.dto'

export const DistrictRoute = createRoute({
  method: 'get',
  path: '/',
  tags: ['Location'],
  responses: new OpenApiResponse({
    successResponse: { schema: DistrictResponseListSchema, description: 'Retrieve list districts' },
  })
})