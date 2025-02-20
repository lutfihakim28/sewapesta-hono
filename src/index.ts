import { cors } from 'hono/cors'
import { getCookie } from 'hono/cookie'
import { honoApp } from './lib/hono'
import { HTTPException } from 'hono/http-exception'
import { jwt, verify } from 'hono/jwt'
import { JwtTokenExpired } from 'hono/utils/jwt/types'
import { logger } from 'hono/logger'
import { messages } from '@/lib/constants/messages'
import { prettyJSON } from 'hono/pretty-json'
import { serveStatic } from 'hono/bun'
import { swaggerUI } from '@hono/swagger-ui'
import { UnauthorizedException } from './lib/exceptions/UnauthorizedException'
import AuthController from './controllers/AuthController'
import CityController from './api/public/locations/cities/City.controller'
import DistrictController from './api/public/locations/districts/District.controller'
import ProvinceController from './api/public/locations/provinces/Province.controller'
import SQLTestController from './controllers/SQLTestController'
import SubdistrictController from './api/public/locations/subdistricts/Subdistrict.controller'
import { ApiResponse } from './lib/dtos/ApiResponse.dto'
import { BadRequestException } from './lib/exceptions/BadRequestException'
import { NotFoundException } from './lib/exceptions/NotFoundException'
import BranchController from './api/private/branches/Branch.controller'

const app = honoApp()

app.onError((error, context) => {
  console.log(error)
  if (error instanceof HTTPException) {
    if (error instanceof UnauthorizedException || error instanceof NotFoundException) {
      return context.json(new ApiResponse({
        code: error.status,
        messages: [error.message]
      }), error.status)
    }
    if (error instanceof BadRequestException) {
      context.json(new ApiResponse({
        code: error.status,
        messages: error.cause as string[]
      }), error.status)
    }
  }
  if (error instanceof JwtTokenExpired) {
    return context.json(new ApiResponse({
      code: 401,
      messages: ['Token kadaluarsa.']
    }), 401)
  }
  return context.json(new ApiResponse({
    code: 500,
    messages: [messages.errorServer]
  }), 500)
})

app.use('/api/*', cors({
  origin: 'http://localhost:5173',
  credentials: true,
}))


app.use('/api/private/*', jwt({ secret: Bun.env.JWT_SECRET }))
app.use('/api/auth/logout', jwt({ secret: Bun.env.JWT_SECRET }))

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
app.route('/api/private/branches', BranchController)
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
