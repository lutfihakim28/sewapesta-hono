import { logger } from 'hono/logger'
import UserController from './controllers/UserController'
import { swaggerUI } from '@hono/swagger-ui'
import { honoApp } from './lib/hono'
import AuthController from './controllers/AuthController'
import { getCookie } from 'hono/cookie'
import { verify } from 'hono/jwt'
import CategoryController from './controllers/CategoryController'
import SubcategoryController from './controllers/SubcategoryController'
import { HTTPException } from 'hono/http-exception'
import { UnauthorizedException } from './exceptions/UnauthorizedException'

const app = honoApp()

app.onError((error, context) => {
  if (error instanceof HTTPException) {
    if (error.status === 401) {
      return context.json({
        code: error.status,
        messages: [error.message],
      }, error.status)
    }
    if (error.status === 404) {
      return context.json({
        code: error.status,
        messages: [error.message],
      }, error.status)
    }
    if (error.status === 422) {
      return context.json({
        code: error.status,
        messages: error.cause,
      }, error.status)
    }
  }
  return context.json({
    code: 500,
    messages: ['Terjadi kesalahan server.']
  }, 500)
})

app.use('/api/auth/logout', async (context, next) => {
  const token = getCookie(context, 'token');
  const secretKey = Bun.env.JWT_SECRET;

  if (!token) {
    throw new UnauthorizedException('Token tidak ditemukan.')
  }

  const payload = await verify(token, secretKey);

  if (!payload) {
    throw new UnauthorizedException('Token kadaluarsa.')
  }

  await next()
})

app.use('/api/private/*', async (context, next) => {
  const token = getCookie(context, 'token');
  const secretKey = Bun.env.JWT_SECRET;

  if (!token) {
    throw new UnauthorizedException('Token tidak ditemukan.')
  }

  const payload = await verify(token, secretKey);

  if (!payload) {
    throw new UnauthorizedException('Token kadaluarsa.')
  }

  await next()
})
app.use(logger())

// PUBLIC PATH
app.route('/api/auth', AuthController)

// PRIVATE PATH
app.route('/api/private/users', UserController)
app.route('/api/private/categories', CategoryController)
app.route('/api/private/subcategories', SubcategoryController)

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
