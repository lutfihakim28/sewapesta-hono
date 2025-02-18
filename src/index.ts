import { cors } from 'hono/cors'
import { getCookie } from 'hono/cookie'
import { honoApp } from './lib/hono'
import { HTTPException } from 'hono/http-exception'
import { JwtTokenExpired } from 'hono/utils/jwt/types'
import { logger } from 'hono/logger'
import { MESSAGES } from '@/lib/constants/MESSAGES'
import { swaggerUI } from '@hono/swagger-ui'
import { UnauthorizedException } from './lib/exceptions/UnauthorizedException'
import { jwt, verify } from 'hono/jwt'
import AuthController from './controllers/AuthController'
import CategoryController from './controllers/CategoryController'
import EmployeeController from './controllers/EmployeeController'
import ItemController from './controllers/ItemController'
import OwnerController from './controllers/OwnerController'
import VehicleController from './controllers/VehicleController'
import { prettyJSON } from 'hono/pretty-json'
import UnitController from './controllers/UnitController'
import { serveStatic } from 'hono/bun'
import ProductController from './controllers/ProductController'
import SQLTestController from './controllers/SQLTestController'
import OrderController from './controllers/OrderController'
import { createSelectSchema } from 'drizzle-zod'
import { provinces } from 'db/schema/provinces'
import { bearerAuth } from 'hono/bearer-auth'
import ProvinceController from './api/public/locations/provinces/Province.controller'
import CityController from './api/public/locations/cities/City.controller'
import DistrictController from './api/public/locations/districts/District.controller'
import SubdistrictController from './api/public/locations/subdistricts/Subdistrict.controller'
// import { NotFoundException } from './exceptions/NotFoundException'

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
  return context.json({
    code: 500,
    messages: [MESSAGES.errorServer]
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
    throw new UnauthorizedException(MESSAGES.tokenNotFound)
  }

  const payload = await verify(token, secretKey);

  if (!payload) {
    throw new UnauthorizedException(MESSAGES.tokenNotFound)
  }

  await next()
})

app.use('/api/private/*', jwt({ secret: Bun.env.JWT_SECRET }))
app.use(logger(), prettyJSON())

// STATIC
app.use('/static/*', serveStatic({ root: './' }))

// PUBLIC PATH
app.route('/api/auth', AuthController)
app.route('/api/public/locations/provinces', ProvinceController)
app.route('/api/public/locations/cities', CityController)
app.route('/api/public/locations/districts', DistrictController)
app.route('/api/public/locations/subdistricts', SubdistrictController)

// PRIVATE PATH
// app.route('/api/private/categories', CategoryController)
// app.route('/api/private/items', ItemController)
// app.route('/api/private/products', ProductController)
// app.route('/api/private/units', UnitController)
// app.route('/api/private/vehicles', VehicleController)

// TEST QUERY
app.route('/api/test', SQLTestController)

app.get(
  '/swagger',
  swaggerUI({
    url: '/docs',
    persistAuthorization: true,
  })
)

app.openAPIRegistry.registerComponent('securitySchemes', 'bearerAuth', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT'
});

app.doc31('/docs', {
  openapi: '3.1.0',
  info: {
    version: '1.0.0',
    title: 'Sewapesta API',
  },
  security: [{
    bearerAuth: []
  }]
})

// const worker = new Worker('src/worker.ts');

// worker.postMessage('start')

export default app
