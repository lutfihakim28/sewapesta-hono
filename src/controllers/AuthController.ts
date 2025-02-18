import { deleteCookie, setCookie } from 'hono/cookie';
import { honoApp } from '@/lib/hono';
import { UserService } from '@/services/UserService';
import { sign } from 'hono/jwt';
import { UnauthorizedException } from '@/lib/exceptions/UnauthorizedException';
import { MESSAGES } from '@/lib/constants/MESSAGES';
import { JWTPayload } from 'hono/utils/jwt/types';
import dayjs from 'dayjs';
import { AuthLoginRoute } from '@/routes/auths/AuthLoginRoute';
import { AuthLogoutRoute } from '@/routes/auths/AuthLogoutRoute';

const AuthController = honoApp()

AuthController.openapi(AuthLoginRoute, async (context) => {
  const loginRequest = context.req.valid('json');

  const user = await UserService.checkCredentials(loginRequest);

  if (!user) {
    throw new UnauthorizedException(MESSAGES.invalidCredential)
  }

  const payload: JWTPayload = {
    id: user.id,
    username: user.username,
    exp: dayjs().add(10, 'years').unix(),
  };

  const secretKey = Bun.env.JWT_SECRET;

  console.log(payload, secretKey)

  const token = await sign(payload, secretKey);

  // setCookie(context, "token", token, {
  //   secure: true,
  //   httpOnly: true,
  // });

  return context.json({
    code: 200,
    messages: MESSAGES.successLogin,
    data: {
      token,
      user: {
        id: user.id,
        username: user.username,
      }
    }
  }, 200)
})

AuthController.openapi(AuthLogoutRoute, async (context) => {
  deleteCookie(context, 'token')

  return context.json({
    code: 200,
    messages: MESSAGES.successLogout
  }, 200)
})

export default AuthController