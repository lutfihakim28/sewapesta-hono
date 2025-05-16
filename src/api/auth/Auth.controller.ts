import { honoApp } from '@/utils/helpers/hono';
import { LoginRoute, LogoutRoute, RefreshRoute } from './Auth.route';
import { UserService } from '../private/users/User.service';
import { AuthService } from './Auth.service';
import { ApiResponse, ApiResponseData } from '@/utils/dtos/ApiResponse.dto';
import { messages } from '@/utils/constants/messages';
import { JwtPayload } from '@/utils/dtos/JwtPayload.dto';

const AuthController = honoApp()

AuthController.openapi(LoginRoute, async (context) => {
  const loginRequest = context.req.valid('json');

  const userId = await UserService.checkCredentials(loginRequest);
  const tokenData = await AuthService.login(userId)

  return context.json(new ApiResponseData({
    code: 200,
    data: tokenData,
    messages: [messages.successLogin]
  }), 200)
})

AuthController.openapi(RefreshRoute, async (context) => {
  const request = context.req.valid('json')

  const tokenData = await AuthService.refresh(request)

  return context.json(new ApiResponseData({
    code: 200,
    data: tokenData,
    messages: [messages.successRefresh]
  }), 200)
})

AuthController.openapi(LogoutRoute, async (context) => {
  const payload = new JwtPayload(context.get('jwtPayload'))

  await AuthService.logout(payload)

  return context.json(new ApiResponse({
    code: 200,
    messages: [messages.successLogout]
  }))
})

export default AuthController