import { honoApp } from '@/utils/helpers/hono';
import { ImageUploadRoute } from 'src/api/private/images/Image.route';
import { ImageService } from './Image.service';
import { ApiResponseData } from '@/utils/dtos/ApiResponse.dto';
import { messages } from '@/utils/constants/locales/messages';
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