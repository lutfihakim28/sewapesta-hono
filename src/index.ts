import { logger } from 'hono/logger'
import UserController from './controllers/UserController'
import { swaggerUI } from '@hono/swagger-ui'
import { honoApp } from './lib/hono'
import AuthController from './controllers/AuthController'
import { getCookie } from 'hono/cookie'
import { verify } from 'hono/jwt'

const app = honoApp()

app.use('/api/auth/logout', async (context, next) => {
  try {
    const token = getCookie(context, 'token');
    const secretKey = Bun.env.JWT_SECRET;

    if (!token) {
      return context.json({
        code: 401,
        messages: ['Token tidak ditemukan.']
      }, 401)
    }

    const payload = await verify(token, secretKey);

    if (!payload) {
      return context.json({
        code: 401,
        messages: ['Token kadaluarsa.']
      }, 401)
    }

    await next()

  } catch (error) {
    return context.json({
      code: 401,
      messages: ['Unauthorized.']
    }, 401)
  }
})

app.use('/api/private/*', async (context, next) => {
  try {
    const token = getCookie(context, 'token');
    const secretKey = Bun.env.JWT_SECRET;

    if (!token) {
      return context.json({
        code: 401,
        messages: ['Token tidak ditemukan.']
      }, 401)
    }

    const payload = await verify(token, secretKey);

    if (!payload) {
      return context.json({
        code: 401,
        messages: ['Token kadaluarsa.']
      }, 401)
    }

    await next()

  } catch (error) {
    return context.json({
      code: 401,
      messages: ['Unauthorized.']
    }, 401)
  }
})
app.use(logger())

// PUBLIC PATH
app.route('/api/auth', AuthController)

// PRIVATE PATH
app.route('/api/private/users', UserController)

app.get(
  '/swagger',
  swaggerUI({
    url: '/doc',
    persistAuthorization: true,
  })
)

app.openAPIRegistry.registerComponent("securitySchemes", "cookieAuth", {
  type: "apiKey",
  name: 'token',
  in: 'cookie'
});

app.doc('/doc', {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'Sewapesta API',
  },
})

export default app
