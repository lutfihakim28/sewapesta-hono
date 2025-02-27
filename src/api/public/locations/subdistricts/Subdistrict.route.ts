import { createRoute } from '@hono/zod-openapi'
import { UnauthorizedSchema } from '@/lib/schemas/Unauthorized.schema'
import { ServerErrorSchema } from '@/lib/schemas/ServerError.schema'
import { SubdistrictFilterSchema, SubdistrictResponseListSchema } from './Subdistrict.schema'
import { OpenApiResponse } from '@/lib/dtos/OpenApiResponse.dto'

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