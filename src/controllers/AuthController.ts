import { deleteCookie, setCookie } from 'hono/cookie';
import { honoApp } from '../lib/hono';
import { AuthLoginRoute, AuthLogoutRoute } from '../routes/AuthRoute';
import { UserService } from '../services/UserService';
import { sign } from 'hono/jwt';

const AuthController = honoApp()

AuthController.openapi(AuthLoginRoute, async (context) => {
  try {
    const { password, username } = context.req.valid('json');

    const user = await UserService.checkCredentials(username, password);

    if (!user) {
      return context.json({
        code: 401,
        messages: ['Username atau password salah.'],
      }, 401)
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
      token,
      user: {
        id: user.id,
        username: user.username,
      }
    }, 200)
  } catch (error) {
    return context.json({
      code: 500,
      messages: ['Terjadi kesalahan server.']
    }, 500)
  }
})

AuthController.openapi(AuthLogoutRoute, async (context) => {
  try {
    deleteCookie(context, 'token')

    return context.json({
      messages: ['Berhasil keluar.']
    }, 200)
  } catch (error) {
    return context.json({
      code: 500,
      messages: ['Terjadi kesalahan server.']
    }, 500)
  }
})

export default AuthController