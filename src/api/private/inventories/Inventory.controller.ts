import { honoApp } from '@/lib/utils/hono';
import { InventoryService } from './Inventory.service';
import { messages } from '@/lib/constants/messages';
import { ApiResponse, ApiResponseData, ApiResponseList } from '@/lib/dtos/ApiResponse.dto';
import { Meta } from '@/lib/dtos/Meta.dto';
import { InventoryCreateRoute, InventoryDeleteRoute, InventoryDetailRoute, InventoryListRoute, InventoryUpdateRoute } from './Inventory.route';

const InventoryController = honoApp()

InventoryController.openapi(InventoryListRoute, async (context) => {
  const query = context.req.valid('query')
  const [inventories, totalData] = await InventoryService.list(query);

  return context.json(new ApiResponseList({
    code: 200,
    messages: [messages.successList('inventory items')],
    meta: new Meta({
      page: query.page!,
      pageSize: query.pageSize!,
      total: totalData
    }),
    data: inventories
  }), 200)
})

InventoryController.openapi(InventoryDetailRoute, async (context) => {
  const param = context.req.valid('param')
  const inventory = await InventoryService.get(+param.id)

  return context.json(new ApiResponseData({
    code: 200,
    messages: [messages.successDetail('inventory item')],
    data: inventory
  }), 200)
})

InventoryController.openapi(InventoryCreateRoute, async (context) => {
  const payload = context.req.valid('json')

  const inventory = await InventoryService.create(payload)

  return context.json(new ApiResponseData({
    code: 200,
    messages: [messages.successCreate(`Inventory item with ID ${inventory.id}`)],
    data: inventory
  }), 200)
})

InventoryController.openapi(InventoryUpdateRoute, async (context) => {
  const param = context.req.valid('param')
  const payload = context.req.valid('json')

  const inventory = await InventoryService.update(+param.id, payload)

  return context.json(new ApiResponseData({
    code: 200,
    messages: [messages.successUpdate(`Inventory item with ID ${inventory.id}`)],
    data: inventory
  }), 200)
})

InventoryController.openapi(InventoryDeleteRoute, async (context) => {
  const param = context.req.valid('param')

  await InventoryService.delete(+param.id)

  return context.json(new ApiResponse({
    code: 200,
    messages: [messages.successDelete(`Inventory item with ID ${param.id}`)],
  }), 200)
})

export default InventoryController