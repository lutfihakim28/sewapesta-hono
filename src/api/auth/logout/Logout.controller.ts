import { honoApp } from '@/lib/hono';
import { LogoutRoute } from './Logout.route';
import { LogoutService } from './Logout.service';
import { messages } from '@/lib/constants/messages';
import { ApiResponse } from '@/lib/dtos/ApiResponse.dto';

const LogoutController = honoApp()

LogoutController.openapi(LogoutRoute, async (context) => {
  const payload = context.get('jwtPayload')

  await LogoutService.logout(payload)

  return context.json(new ApiResponse({
    code: 200,
    messages: [messages.successLogout]
  }))
})

export default LogoutController