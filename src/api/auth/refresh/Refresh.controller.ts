import { honoApp } from '@/lib/hono';
import { RefreshRoute } from './Refresh.route';
import { RefreshService } from './Refresh.service';
import { messages } from '@/lib/constants/messages';
import { ApiResponseData } from '@/lib/dtos/ApiResponse.dto';

const RefreshController = honoApp()

RefreshController.openapi(RefreshRoute, async (context) => {
  console.log('tes')
  const request = context.req.valid('json')

  const tokenData = await RefreshService.refresh(request)

  return context.json(new ApiResponseData({
    code: 200,
    data: tokenData,
    messages: [messages.successLogin]
  }), 200)
})

export default RefreshController