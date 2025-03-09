import { cors } from 'hono/cors'
import { honoApp } from './lib/utils/hono'
import { HTTPException } from 'hono/http-exception'
import { jwt, } from 'hono/jwt'
import { JwtTokenExpired } from 'hono/utils/jwt/types'
import { logger } from 'hono/logger'
import { logger as pinoLogger } from '@/lib/utils/logger'
import { messages } from '@/lib/constants/messages'
import { prettyJSON } from 'hono/pretty-json'
import { serveStatic } from 'hono/bun'
import { apiReference } from '@scalar/hono-api-reference'
import CityController from './api/public/locations/cities/City.controller'
import DistrictController from './api/public/locations/districts/District.controller'
import ProvinceController from './api/public/locations/provinces/Province.controller'
import SubdistrictController from './api/public/locations/subdistricts/Subdistrict.controller'
import { ApiResponse } from './lib/dtos/ApiResponse.dto'
import BranchController from './api/private/branches/Branch.controller'
import { authMiddleware } from './lib/middlewares/auth.middleware'
import AuthController from './api/auth/Auth.controller'
import CategoryController from './api/private/categories/Category.controller'
import ProductController from './api/private/products/Product.controller'
import { adminMiddleware } from './lib/middlewares/admin.middleware'
import { superadminMiddleware } from './lib/middlewares/superadmin.middleware'
import UnitController from './api/private/units/Unit.controller'

const app = honoApp()

app.use(logger(), prettyJSON())
app.onError((error, context) => {
  if (error instanceof HTTPException) {
    if (error.status === 401 || error.status === 404) {
      return context.json(new ApiResponse({
        code: error.status,
        messages: [error.message]
      }), error.status)
    }
    if (error.status === 422) {
      return context.json(new ApiResponse({
        code: error.status,
        messages: error.cause ? error.cause as string[] : error.message.split(',')
      }), error.status)
    }
    if (error.status === 403) {
      return context.json(new ApiResponse({
        code: error.status,
        messages: [error.message]
      }), error.status)
    }
  }
  if (error instanceof JwtTokenExpired) {
    return context.json(new ApiResponse({
      code: 401,
      messages: ['Token expired.']
    }), 401)
  }
  pinoLogger.error({ error: error.message, stack: error.stack }, 'Unhandled Error')
  return context.json(new ApiResponse({
    code: 500,
    messages: [messages.errorServer]
  }), 500)
})
app.use('/api/*', cors({
  origin: 'http://localhost:5173',
  credentials: true,
}))
app.use('/api/private/*', jwt({ secret: Bun.env.JWT_SECRET }), authMiddleware)
app.use('/api/auth/logout', jwt({ secret: Bun.env.JWT_SECRET }))
app.use('/static/*', serveStatic({ root: './' }))

// MIDDLEWARES
app.post('/api/private/branches', superadminMiddleware)
app.delete('/api/private/branches', superadminMiddleware)
app.use('/api/private/branches/*', adminMiddleware)
app.use('/api/private/products/*', adminMiddleware)
app.post('/api/private/categories', superadminMiddleware)
app.put('/api/private/categories/*', superadminMiddleware)
app.delete('/api/private/categories/*', superadminMiddleware)
app.post('/api/private/units', superadminMiddleware)
app.put('/api/private/units/*', superadminMiddleware)
app.delete('/api/private/units/*', superadminMiddleware)

// AUTH
app.route('/api/auth', AuthController)

// PRIVATE PATH
app.route('/api/private/branches', BranchController)
app.route('/api/private/categories', CategoryController)
app.route('/api/private/units', UnitController)
app.route('/api/private/products', ProductController)

// PUBLIC PATH
app.route('/api/public/locations/provinces', ProvinceController)
app.route('/api/public/locations/cities', CityController)
app.route('/api/public/locations/districts', DistrictController)
app.route('/api/public/locations/subdistricts', SubdistrictController)


app.get(
  '/scalar',
  apiReference({
    theme: 'deepSpace',
    spec: { url: '/docs' },
    pageTitle: 'Sewapesta API',
    darkMode: true,
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
