import { adminMiddleware } from '@/utils/middlewares/admin.middleware'
import { authMiddleware } from '@/utils/middlewares/auth.middleware'
import { cors } from 'hono/cors'
import { honoApp } from '@/utils/helpers/hono'
import { jwt, } from 'hono/jwt'
import { languageDetector } from 'hono/language'
import { logger } from 'hono/logger'
import { prettyJSON } from 'hono/pretty-json'
import { Scalar } from '@scalar/hono-api-reference'
import { serveStatic } from 'hono/bun'
import { superadminMiddleware } from '@/utils/middlewares/superadmin.middleware'
import { swaggerUI } from '@hono/swagger-ui'
import AuthController from '@/api/auth/Auth.controller'
import CategoryController from '@/api/private/categories/Category.controller'
import CityController from '@/api/public/locations/cities/City.controller'
import DistrictController from '@/api/public/locations/districts/District.controller'
import EquipmentController from '@/api/private/equipments/Equipment.controller'
import ImageController from '@/api/private/images/Image.controller'
import InventoryController from '@/api/private/inventories/Inventory.controller'
import InventoryDamageReportController from '@/api/private/inventory-damage-reports/InventoryDamageReport.controller'
import InventoryMutationController from '@/api/private/inventory-mutations/InventoryMutation.controller'
import InventoryUsageController from '@/api/private/inventory-usages/InventoryUsage.controller'
import ItemController from '@/api/private/items/Item.controller'
import ItemRevenueTermController from '@/api/private/item-revenue-terms/ItemRevenueTerm.controller'
import OwnerRevenueTermController from '@/api/private/owner-revenue-terms/OwnerRevenueTerm.controller'
import PackageController from '@/api/private/packages/Package.controller'
import PackageItemController from '@/api/private/package-items/PackageItem.controller'
import ProductController from '@/api/private/products/Product.controller'
import ProvinceController from '@/api/public/locations/provinces/Province.controller'
import SubdistrictController from '@/api/public/locations/subdistricts/Subdistrict.controller'
import UnitController from '@/api/private/units/Unit.controller'
import UserController from '@/api/private/users/User.controller';
import { AcceptedLocale } from '@/utils/constants/locales/locale'
import { errorHandler } from '@/utils/helpers/error-handler'

const app = honoApp()

const supportedLanguages: AcceptedLocale[] = ['en', 'id']

app.use(logger(), prettyJSON(), languageDetector({
  supportedLanguages,
  fallbackLanguage: 'en',
}))
app.onError(errorHandler)
app.use('/api/*', cors({
  origin: ['http://localhost:5173', 'http://192.168.2.224:5173'],
  credentials: true,
}))
app.use('/api/private/*', jwt({ secret: Bun.env.ACCESS_TOKEN_SECRET }), authMiddleware)
// app.use('/api/auth/logout', jwt({ secret: Bun.env.ACCESS_TOKEN_SECRET }))
app.use('/static/*', serveStatic({ root: './' }))

app.use('/api/private/products/*', adminMiddleware)
app.use('/api/private/packages/*', adminMiddleware)
app.use('/api/private/package-items/*', adminMiddleware)
app.use('/api/private/items/*', adminMiddleware)
app.use('/api/private/equipments/*', adminMiddleware)
app.use('/api/private/inventories/*', adminMiddleware)
app.use('/api/private/inventory-mutations/*', adminMiddleware)
app.use('/api/private/inventory-usages/*', adminMiddleware)
app.use('/api/private/inventory-damage-reports/*', adminMiddleware)
app.use('/api/private/items-revenue-terms/*', adminMiddleware)
app.use('/api/private/owner-revenue-terms/*', adminMiddleware)

app.get('/api/private/users', adminMiddleware)
app.post('/api/private/users', adminMiddleware)
app.put('/api/private/users/*', adminMiddleware)
app.delete('/api/private/users/*', adminMiddleware)
app.patch('/api/private/users/:id/roles', adminMiddleware)

app.post('/api/private/categories', superadminMiddleware)
app.put('/api/private/categories/*', superadminMiddleware)
app.delete('/api/private/categories/*', superadminMiddleware)

app.post('/api/private/units', superadminMiddleware)
app.put('/api/private/units/*', superadminMiddleware)
app.delete('/api/private/units/*', superadminMiddleware)

// AUTH
app.route('/api/auth', AuthController)

// PRIVATE PATH
app.route('/api/private/categories', CategoryController)
app.route('/api/private/units', UnitController)
app.route('/api/private/products', ProductController)
app.route('/api/private/packages', PackageController)
app.route('/api/private/package-items', PackageItemController)
app.route('/api/private/items', ItemController)
app.route('/api/private/equipments', EquipmentController)
app.route('/api/private/inventories', InventoryController)
app.route('/api/private/inventory-mutations', InventoryMutationController)
app.route('/api/private/inventory-usages', InventoryUsageController)
app.route('/api/private/inventory-damage-reports', InventoryDamageReportController)
app.route('/api/private/inventory-revenue-terms', ItemRevenueTermController)
app.route('/api/private/images', ImageController)
app.route('/api/private/users', UserController)
app.route('/api/private/owner-revenue-terms', OwnerRevenueTermController)

// PUBLIC PATH
app.route('/api/public/locations/provinces', ProvinceController)
app.route('/api/public/locations/cities', CityController)
app.route('/api/public/locations/districts', DistrictController)
app.route('/api/public/locations/subdistricts', SubdistrictController)


app.get(
  '/swagger',
  swaggerUI({
    url: '/docs',
    persistAuthorization: true,
  })
)

app.get('/scalar', Scalar({ url: '/docs', theme: 'alternate' }))

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
