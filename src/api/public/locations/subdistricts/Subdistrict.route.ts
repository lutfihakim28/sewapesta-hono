import { createRoute } from '@hono/zod-openapi'
import { SubdistrictResponseListSchema } from './Subdistrict.schema'
import { OpenApiResponse } from '@/utils/dtos/OpenApiResponse.dto'

export const SubdistrictRoute = createRoute({
  method: 'get',
  path: '/',
  tags: ['Location'],
  responses: new OpenApiResponse({
    successResponse: { schema: SubdistrictResponseListSchema, description: 'Retrieve list subdistricts' },
  })
})