import { createRoute } from '@hono/zod-openapi';
import { ImageUploadResponse, ImageRequestSchema } from './Image.schema';
import { OpenApiResponse } from '@/lib/dtos/OpenApiResponse.dto';

export const ImageUploadRoute = createRoute({
  method: 'post',
  path: '/',
  tags: ['Image'],
  request: {
    body: {
      content: {
        "multipart/form-data": {
          schema: ImageRequestSchema
        }
      },
    },
  },
  responses: new OpenApiResponse({
    successResponse: { schema: ImageUploadResponse, description: 'Image Uploaded' },
    codes: [401, 422],
  }),
})