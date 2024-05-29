import { deleteCookie, setCookie } from 'hono/cookie';
import { honoApp } from '@/lib/hono';
import { AuthLoginRoute, AuthLogoutRoute } from '@/routes/AuthRoute';
import { UserService } from '@/services/UserService';
import { sign } from 'hono/jwt';
import { UnauthorizedException } from '@/exceptions/UnauthorizedException';

const AuthController = honoApp()

AuthController.openapi(AuthLoginRoute, async (context) => {
  const loginRequest = context.req.valid('json');

  const user = await UserService.checkCredentials(loginRequest);

  if (!user) {
    throw new UnauthorizedException('Username atau password salah.')
  }

  const payload = {
    id: user.id,
    username: user.username,
    exp: Math.floor(Date.now() / 1000) + 60 * 20,
  };

  const secretKey = Bun.env.JWT_SECRET;

  const token = await sign(payload, secretKey);

  setCookie(context, "token", token, {
    secure: true,
    httpOnly: true,
  });

  return context.json({
    code: 200,
    messages: ['Berhasil login'],
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
    messages: ['Berhasil keluar.']
  }, 200)
})

export default AuthController