import { honoApp } from '@/utils/helpers/hono';
import { PackageItemService } from './PackageItem.service';
import { messages } from '@/utils/constants/locales/messages';
import { ApiResponse, ApiResponseData, ApiResponseList } from '@/utils/dtos/ApiResponse.dto';
import { Meta } from '@/utils/dtos/Meta.dto';
import { PackageItemListRoute, PackageItemCreateRoute, PackageItemDeleteRoute, PackageItemDetailRoute, PackageItemUpdateRoute } from './PackageItem.route';

const PackageItemController = honoApp()

PackageItemController.openapi(PackageItemListRoute, async (context) => {
  const query = context.req.valid('query')
  const [packageItems, totalData] = await PackageItemService.list(query);

  return context.json(new ApiResponseList({
    code: 200,
    messages: [messages.successList('package items')],
    meta: new Meta({
      page: query.page!,
      pageSize: query.pageSize!,
      total: totalData
    }),
    data: packageItems
  }), 200)
})

PackageItemController.openapi(PackageItemDetailRoute, async (context) => {
  const param = context.req.valid('param')
  const packageItem = await PackageItemService.get(+param.id)

  return context.json(new ApiResponseData({
    code: 200,
    messages: [messages.successDetail('package item')],
    data: packageItem
  }), 200)
})

PackageItemController.openapi(PackageItemCreateRoute, async (context) => {
  const payload = context.req.valid('json')

  const packageItem = await PackageItemService.create(payload)

  return context.json(new ApiResponseData({
    code: 200,
    messages: [messages.successCreate(`Inventory item mutation with ID ${packageItem.id}`)],
    data: packageItem
  }), 200)
})

PackageItemController.openapi(PackageItemUpdateRoute, async (context) => {
  const param = context.req.valid('param')
  const payload = context.req.valid('json')

  const packageItem = await PackageItemService.update(+param.id, payload)

  return context.json(new ApiResponseData({
    code: 200,
    messages: [messages.successUpdate(`Inventory item mutation with ID ${packageItem.id}`)],
    data: packageItem
  }), 200)
})

PackageItemController.openapi(PackageItemDeleteRoute, async (context) => {
  const param = context.req.valid('param')

  await PackageItemService.delete(+param.id)

  return context.json(new ApiResponse({
    code: 200,
    messages: [messages.successDelete(`Inventory item mutation with ID ${param.id}`)],
  }), 200)
})

export default PackageItemController