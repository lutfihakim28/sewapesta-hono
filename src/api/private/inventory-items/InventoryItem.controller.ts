import { honoApp } from '@/lib/utils/hono';
import { InventoryItemService } from './InventoryItem.service';
import { messages } from '@/lib/constants/messages';
import { ApiResponse, ApiResponseData, ApiResponseList } from '@/lib/dtos/ApiResponse.dto';
import { Meta } from '@/lib/dtos/Meta.dto';
import { InventoryItemCreateRoute, InventoryItemDeleteRoute, InventoryItemDetailRoute, InventoryItemListRoute, InventoryItemUpdateRoute } from './InventoryItem.route';

const InventoryItemController = honoApp()

InventoryItemController.openapi(InventoryItemListRoute, async (context) => {
  const query = context.req.valid('query')
  const [inventoryItems, totalData] = await InventoryItemService.list(query);

  return context.json(new ApiResponseList({
    code: 200,
    messages: [messages.successList('inventory items')],
    meta: new Meta({
      page: query.page!,
      pageSize: query.pageSize!,
      total: totalData
    }),
    data: inventoryItems
  }), 200)
})

InventoryItemController.openapi(InventoryItemDetailRoute, async (context) => {
  const param = context.req.valid('param')
  const inventoryItem = await InventoryItemService.get(+param.id)

  return context.json(new ApiResponseData({
    code: 200,
    messages: [messages.successDetail('inventory item')],
    data: inventoryItem
  }), 200)
})

InventoryItemController.openapi(InventoryItemCreateRoute, async (context) => {
  const payload = context.req.valid('json')

  const inventoryItem = await InventoryItemService.create(payload)

  return context.json(new ApiResponseData({
    code: 200,
    messages: [messages.successCreate(`Inventory item with ID ${inventoryItem.id}`)],
    data: inventoryItem
  }), 200)
})

InventoryItemController.openapi(InventoryItemUpdateRoute, async (context) => {
  const param = context.req.valid('param')
  const payload = context.req.valid('json')

  const inventoryItem = await InventoryItemService.update(+param.id, payload)

  return context.json(new ApiResponseData({
    code: 200,
    messages: [messages.successUpdate(`Inventory item with ID ${inventoryItem.id}`)],
    data: inventoryItem
  }), 200)
})

InventoryItemController.openapi(InventoryItemDeleteRoute, async (context) => {
  const param = context.req.valid('param')

  await InventoryItemService.delete(+param.id)

  return context.json(new ApiResponse({
    code: 200,
    messages: [messages.successDelete(`Inventory item with ID ${param.id}`)],
  }), 200)
})

export default InventoryItemController