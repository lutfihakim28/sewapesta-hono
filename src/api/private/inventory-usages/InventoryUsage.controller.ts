import { honoApp } from '@/utils/helpers/hono';
import { InventoryUsageService } from './InventoryUsage.service';
import { messages } from '@/utils/constants/locales/messages';
import { ApiResponse, ApiResponseData, ApiResponseList } from '@/utils/dtos/ApiResponse.dto';
import { Meta } from '@/utils/dtos/Meta.dto';
import { InventoryUsageCreateRoute, InventoryUsageDeleteRoute, InventoryUsageDetailRoute, InventoryUsageListRoute, InventoryUsageUpdateRoute } from './InventoryUsage.route';

const InventoryUsageController = honoApp()

InventoryUsageController.openapi(InventoryUsageListRoute, async (context) => {
  const query = context.req.valid('query')
  const [inventoryUsages, totalData] = await InventoryUsageService.list(query);

  return context.json(new ApiResponseList({
    code: 200,
    messages: [messages.successList('inventory usages')],
    meta: new Meta({
      page: query.page!,
      pageSize: query.pageSize!,
      total: totalData
    }),
    data: inventoryUsages
  }), 200)
})

InventoryUsageController.openapi(InventoryUsageDetailRoute, async (context) => {
  const param = context.req.valid('param')
  const inventoryUsage = await InventoryUsageService.get(+param.id)

  return context.json(new ApiResponseData({
    code: 200,
    messages: [messages.successDetail('Inventory usage')],
    data: inventoryUsage
  }), 200)
})

InventoryUsageController.openapi(InventoryUsageCreateRoute, async (context) => {
  const payload = context.req.valid('json')

  const inventoryUsage = await InventoryUsageService.create(payload)

  return context.json(new ApiResponseData({
    code: 200,
    messages: [messages.successCreate(`Inventory usage with ID ${inventoryUsage.id}`)],
    data: inventoryUsage
  }), 200)
})

InventoryUsageController.openapi(InventoryUsageUpdateRoute, async (context) => {
  const param = context.req.valid('param')
  const payload = context.req.valid('json')

  const inventoryUsage = await InventoryUsageService.update(+param.id, payload)

  return context.json(new ApiResponseData({
    code: 200,
    messages: [messages.successUpdate(`Inventory usage with ID ${inventoryUsage.id}`)],
    data: inventoryUsage
  }), 200)
})

InventoryUsageController.openapi(InventoryUsageDeleteRoute, async (context) => {
  const param = context.req.valid('param')

  await InventoryUsageService.delete(+param.id)

  return context.json(new ApiResponse({
    code: 200,
    messages: [messages.successDelete(`Inventory usage with ID ${param.id}`)],
  }), 200)
})

export default InventoryUsageController