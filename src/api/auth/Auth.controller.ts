import { honoApp } from '@/lib/hono';
import { CheckUsernameRoute, LoginRoute, LogoutRoute, RefreshRoute, RegisterRoute } from './Auth.route';
import { UserService } from '../private/users/User.service';
import { AuthService } from './Auth.service';
import { ApiResponse, ApiResponseData } from '@/lib/dtos/ApiResponse.dto';
import { messages } from '@/lib/constants/messages';
import { BadRequestException } from '@/lib/exceptions/BadRequestException';

const AuthController = honoApp()

AuthController.openapi(RegisterRoute, async (context) => {
  const registerRequest = context.req.valid('json');

  await AuthService.register(registerRequest)

  return context.json(new ApiResponse({
    code: 200,
    messages: [messages.successRegister]
  }), 200)
})

AuthController.openapi(LoginRoute, async (context) => {
  const loginRequest = context.req.valid('json');

  const user = await UserService.checkCredentials(loginRequest);
  const tokenData = await AuthService.login(user)

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
    messages: [messages.successLogin]
  }), 200)
})

AuthController.openapi(LogoutRoute, async (context) => {
  const payload = context.get('jwtPayload')

  await AuthService.logout(payload)

  return context.json(new ApiResponse({
    code: 200,
    messages: [messages.successLogout]
  }))
})

AuthController.openapi(CheckUsernameRoute, async (context) => {
  const request = context.req.valid('json')

  const existingUser = await AuthService.checkUsername(request);

  if (existingUser) {
    throw new BadRequestException('Username is already taken.')
  }

  return context.json(new ApiResponse({
    code: 200,
    messages: ['Username available.']
  }))
})

export default AuthController