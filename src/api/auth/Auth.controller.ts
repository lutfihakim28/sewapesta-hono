import { honoApp } from '@/utils/helpers/hono';
import { LoginRoute, LogoutRoute, RefreshRoute } from './Auth.route';
import { UserService } from '../private/users/User.service';
import { AuthService } from './Auth.service';
import { ApiResponse, ApiResponseData } from '@/utils/dtos/ApiResponse.dto';
import { messages } from '@/utils/constants/locales/messages';
import { JwtPayload } from '@/utils/dtos/JwtPayload.dto';
import { deleteCookie, getCookie, setCookie } from 'hono/cookie';
import { UnauthorizedException } from '@/utils/exceptions/UnauthorizedException';
import { decode } from 'hono/jwt';

const refreshCookieKey = 'refresh_token';
const AuthController = honoApp()

AuthController.openapi(LoginRoute, async (context) => {
  const loginRequest = context.req.valid('json');

  const userId = await UserService.checkCredentials(loginRequest);
  const [tokenData, refreshToken] = await AuthService.login(userId)

  setCookie(context, refreshCookieKey, refreshToken, {
    path: '/api/auth/refresh',
    maxAge: 60 * 60 * 24 * 7,
    secure: true,
    httpOnly: true,
    sameSite: 'none',
  })

  return context.json(new ApiResponseData({
    code: 200,
    data: tokenData,
    messages: [messages.successLogin]
  }), 200)
})

AuthController.openapi(RefreshRoute, async (context) => {
  const refreshToken = getCookie(context, refreshCookieKey);

  if (!refreshToken) {
    throw new UnauthorizedException(messages.unauthorized);
  }

  const response = await AuthService.refresh(refreshToken)

  if (!response) {
    deleteCookie(context, refreshCookieKey)
    throw new UnauthorizedException(messages.unauthorized);
  }

  const [tokenData, newRefreshToken] = response;

  setCookie(context, refreshCookieKey, newRefreshToken, {
    path: '/api/auth/refresh',
    maxAge: 60 * 60 * 24 * 7,
    secure: true,
    httpOnly: true,
    sameSite: 'none',
  })

  return context.json(new ApiResponseData({
    code: 200,
    data: tokenData,
    messages: [messages.successRefresh]
  }), 200)
})

AuthController.openapi(LogoutRoute, async (context) => {
  const refreshToken = getCookie(context, refreshCookieKey);

  if (refreshToken) {
    const { payload } = decode(refreshToken);
    await AuthService.logout(new JwtPayload(payload))
    deleteCookie(context, refreshCookieKey)
  }

  return context.json(new ApiResponse({
    code: 200,
    messages: [messages.successLogout]
  }))
})

export default AuthController