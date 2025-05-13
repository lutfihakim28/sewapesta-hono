import { honoApp } from '@/lib/utils/hono';
import { PackageService } from './Package.service';
import { messages } from '@/lib/constants/messages';
import { ApiResponse, ApiResponseData, ApiResponseList } from '@/lib/dtos/ApiResponse.dto';
import { Meta } from '@/lib/dtos/Meta.dto';
import { PackageCreateRoute, PackageDeleteRoute, PackageDetailRoute, PackageListRoute, PackageUpdateRoute } from './Package.route';

const PackageController = honoApp()

PackageController.openapi(PackageListRoute, async (context) => {
  const query = context.req.valid('query')
  const [products, totalData] = await PackageService.list(query);

  return context.json(new ApiResponseList({
    code: 200,
    messages: [messages.successList('product')],
    meta: new Meta({
      page: query.page!,
      pageSize: query.pageSize!,
      total: totalData
    }),
    data: products
  }), 200)
})

PackageController.openapi(PackageDetailRoute, async (context) => {
  const param = context.req.valid('param')
  const product = await PackageService.get(+param.id)

  return context.json(new ApiResponseData({
    code: 200,
    messages: [messages.successDetail('product')],
    data: product
  }), 200)
})

PackageController.openapi(PackageCreateRoute, async (context) => {
  const payload = context.req.valid('json')

  const product = await PackageService.create(payload)

  return context.json(new ApiResponseData({
    code: 200,
    messages: [messages.successCreate(`Package with name ${product.name}`)],
    data: product
  }), 200)
})

PackageController.openapi(PackageUpdateRoute, async (context) => {
  const param = context.req.valid('param')
  const payload = context.req.valid('json')

  const product = await PackageService.update(+param.id, payload)

  return context.json(new ApiResponseData({
    code: 200,
    messages: [messages.successUpdate(`Package with ID ${product.id}`)],
    data: product
  }), 200)
})

PackageController.openapi(PackageDeleteRoute, async (context) => {
  const param = context.req.valid('param')

  await PackageService.delete(+param.id)

  return context.json(new ApiResponse({
    code: 200,
    messages: [messages.successDelete(`Package with ID ${param.id}`)],
  }), 200)
})

export default PackageController