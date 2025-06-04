import { honoApp } from '@/utils/helpers/hono';
import { ImageUploadRoute } from 'src/api/private/images/Image.route';
import { ImageService } from './Image.service';
import { ApiResponseData } from '@/utils/dtos/ApiResponse.dto';
import { ImageRequest } from './Image.schema';
import { AcceptedLocale, tData, tMessage } from '@/utils/constants/locales/locale';

const ImageController = honoApp()

ImageController.openapi(ImageUploadRoute, async (context) => {
  const lang = context.get('language') as AcceptedLocale
  const payload = await context.req.parseBody() as unknown as ImageRequest

  const image = await ImageService.upload(payload)

  return context.json(new ApiResponseData({
    code: 200,
    messages: [
      tMessage({
        lang,
        key: 'successUpload',
        textCase: 'sentence',
        params: {
          data: tData({ lang, key: 'image' })
        }
      })
    ],
    data: image,
  }))
})

export default ImageController