import { createRoute } from '@hono/zod-openapi'
import { SubdistrictFilterSchema, SubdistrictResponseListSchema } from './Subdistrict.schema'
import { OpenApiResponse } from '@/utils/dtos/OpenApiResponse.dto'

export const SubdistrictRoute = createRoute({
  method: 'get',
  path: '/',
  tags: ['Location'],
  request: {
    query: SubdistrictFilterSchema,
  },
  responses: new OpenApiResponse({
    successResponse: { schema: SubdistrictResponseListSchema, description: 'Retrieve list subdistricts' },
  })
})