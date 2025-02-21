import { honoApp } from '@/lib/hono';
import { LoginRoute } from './Login.route';
import { UserService } from '@/api/private/users/User.service';
import { UnauthorizedException } from '@/lib/exceptions/UnauthorizedException';
import { messages } from '@/lib/constants/messages';
import { LoginService } from './Login.service';
import { ApiResponseData } from '@/lib/dtos/ApiResponse.dto';

const LoginController = honoApp()

LoginController.openapi(LoginRoute, async (context) => {
  const loginRequest = context.req.valid('json');

  const user = await UserService.checkCredentials(loginRequest);

  if (!user) {
    throw new UnauthorizedException(messages.invalidCredential)
  }

  const tokenData = await LoginService.login(user)

  return context.json(new ApiResponseData({
    code: 200,
    data: tokenData,
    messages: [messages.successLogin]
  }), 200)
})

export default LoginController