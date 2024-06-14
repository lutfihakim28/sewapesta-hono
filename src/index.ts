import { cors } from 'hono/cors'
import { getCookie } from 'hono/cookie'
import { honoApp } from './lib/hono'
import { HTTPException } from 'hono/http-exception'
import { JwtTokenExpired } from 'hono/utils/jwt/types'
import { logger } from 'hono/logger'
import { messages } from './constatnts/messages'
import { swaggerUI } from '@hono/swagger-ui'
import { UnauthorizedException } from './exceptions/UnauthorizedException'
import { verify } from 'hono/jwt'
import AccountController from './controllers/AccountController'
import AuthController from './controllers/AuthController'
import CategoryController from './controllers/CategoryController'
import EmployeeController from './controllers/EmployeeController'
import ItemController from './controllers/ItemController'
import OwnerController from './controllers/OwnerController'
import SubcategoryController from './controllers/SubcategoryController'
import VehicleController from './controllers/VehicleController'
import { prettyJSON } from 'hono/pretty-json'
import UnitController from './controllers/UnitController'
import { serveStatic } from 'hono/bun'

const app = honoApp()

app.onError((error, context) => {
  console.log(error)
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
  if (error instanceof JwtTokenExpired) {
    return context.json({
      code: 401,
      messages: ['Token kadaluarsa.']
    }, 401)
  }
  console.log(error)
  return context.json({
    code: 500,
    messages: [messages.errorServer]
  }, 500)
})

app.use('/api/*', cors({
  origin: 'http://localhost:5173',
  credentials: true,
}))

app.use('/api/auth/logout', async (context, next) => {
  const token = getCookie(context, 'token');
  const secretKey = Bun.env.JWT_SECRET;

  if (!token) {
    throw new UnauthorizedException(messages.tokenNotFound)
  }

  const payload = await verify(token, secretKey);

  if (!payload) {
    throw new UnauthorizedException(messages.tokenNotFound)
  }

  await next()
})

app.use('/api/private/*', async (context, next) => {
  const token = getCookie(context, 'token');
  const secretKey = Bun.env.JWT_SECRET;

  if (!token) {
    throw new UnauthorizedException(messages.tokenNotFound)
  }

  const payload = await verify(token, secretKey);

  if (!payload) {
    throw new UnauthorizedException(messages.tokenNotFound)
  }

  await next()
})
app.use(logger(), prettyJSON())

// STATIC
app.use('/static/*', serveStatic({ root: './' }))

// PUBLIC PATH
app.route('/api/auth', AuthController)

// PRIVATE PATH
app.route('/api/private/accounts', AccountController)
app.route('/api/private/categories', CategoryController)
app.route('/api/private/employees', EmployeeController)
app.route('/api/private/items', ItemController)
app.route('/api/private/owners', OwnerController)
app.route('/api/private/units', UnitController)
app.route('/api/private/subcategories', SubcategoryController)
app.route('/api/private/vehicles', VehicleController)

app.get(
  '/swagger',
  swaggerUI({
    url: '/docs',
    persistAuthorization: true,
  })
)

app.openAPIRegistry.registerComponent('securitySchemes', 'cookieAuth', {
  type: 'apiKey',
  name: 'token',
  in: 'cookie'
});

app.doc31('/docs', {
  openapi: '3.1.0',
  info: {
    version: '1.0.0',
    title: 'Sewapesta API',
  },
})

export default app
