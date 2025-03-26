import { honoApp } from '@/lib/utils/hono';
import { ImageUploadRoute } from 'src/api/private/images/Image.route';
import { ImageService } from './Image.service';
import { ApiResponseData } from '@/lib/dtos/ApiResponse.dto';
import { messages } from '@/lib/constants/messages';
import { ImageRequest } from './Image.schema';

const ImageController = honoApp()

ImageController.openapi(ImageUploadRoute, async (context) => {
  const payload = await context.req.parseBody() as unknown as ImageRequest

  const image = await ImageService.upload(payload)

  return context.json(new ApiResponseData({
    code: 200,
    messages: [messages.successUpload('Image')],
    data: image,
  }))
})

export default ImageController