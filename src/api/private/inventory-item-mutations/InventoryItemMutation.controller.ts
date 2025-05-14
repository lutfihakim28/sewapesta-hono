import { honoApp } from '@/lib/utils/hono';
import { InventoryItemMutationService } from './InventoryItemMutation.service';
import { messages } from '@/lib/constants/messages';
import { ApiResponse, ApiResponseData, ApiResponseList } from '@/lib/dtos/ApiResponse.dto';
import { Meta } from '@/lib/dtos/Meta.dto';
import { InventoryItemMutationCreateRoute, InventoryItemMutationDeleteRoute, InventoryItemMutationDetailRoute, InventoryItemMutationListRoute, InventoryItemMutationUpdateRoute } from './InventoryItemMutation.route';

const InventoryItemMutationController = honoApp()

InventoryItemMutationController.openapi(InventoryItemMutationListRoute, async (context) => {
  const query = context.req.valid('query')
  const [inventoryItemMutations, totalData] = await InventoryItemMutationService.list(query);

  return context.json(new ApiResponseList({
    code: 200,
    messages: [messages.successList('inventory item mutations')],
    meta: new Meta({
      page: query.page!,
      pageSize: query.pageSize!,
      total: totalData
    }),
    data: inventoryItemMutations
  }), 200)
})

InventoryItemMutationController.openapi(InventoryItemMutationDetailRoute, async (context) => {
  const param = context.req.valid('param')
  const inventoryItemMutation = await InventoryItemMutationService.get(+param.id)

  return context.json(new ApiResponseData({
    code: 200,
    messages: [messages.successDetail('inventory item mutation')],
    data: inventoryItemMutation
  }), 200)
})

InventoryItemMutationController.openapi(InventoryItemMutationCreateRoute, async (context) => {
  const payload = context.req.valid('json')

  const inventoryItemMutation = await InventoryItemMutationService.create(payload)

  return context.json(new ApiResponseData({
    code: 200,
    messages: [messages.successCreate(`Inventory item mutation with ID ${inventoryItemMutation.id}`)],
    data: inventoryItemMutation
  }), 200)
})

InventoryItemMutationController.openapi(InventoryItemMutationUpdateRoute, async (context) => {
  const param = context.req.valid('param')
  const payload = context.req.valid('json')

  const inventoryItemMutation = await InventoryItemMutationService.update(+param.id, payload)

  return context.json(new ApiResponseData({
    code: 200,
    messages: [messages.successUpdate(`Inventory item mutation with ID ${inventoryItemMutation.id}`)],
    data: inventoryItemMutation
  }), 200)
})

InventoryItemMutationController.openapi(InventoryItemMutationDeleteRoute, async (context) => {
  const param = context.req.valid('param')

  await InventoryItemMutationService.delete(+param.id)

  return context.json(new ApiResponse({
    code: 200,
    messages: [messages.successDelete(`Inventory item mutation with ID ${param.id}`)],
  }), 200)
})

export default InventoryItemMutationController