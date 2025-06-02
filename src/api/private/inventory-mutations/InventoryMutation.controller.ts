import { honoApp } from '@/utils/helpers/hono';
import { InventoryMutationService } from './InventoryMutation.service';
import { messages } from '@/utils/constants/locales/messages';
import { ApiResponse, ApiResponseData, ApiResponseList } from '@/utils/dtos/ApiResponse.dto';
import { Meta } from '@/utils/dtos/Meta.dto';
import { InventoryMutationCreateRoute, InventoryMutationDeleteRoute, InventoryMutationDetailRoute, InventoryMutationListRoute, InventoryMutationUpdateRoute } from './InventoryMutation.route';

const InventoryMutationController = honoApp()

InventoryMutationController.openapi(InventoryMutationListRoute, async (context) => {
  const query = context.req.valid('query')
  const [inventoryMutations, totalData] = await InventoryMutationService.list(query);

  return context.json(new ApiResponseList({
    code: 200,
    messages: [messages.successList('inventory mutations')],
    meta: new Meta({
      page: query.page!,
      pageSize: query.pageSize!,
      total: totalData
    }),
    data: inventoryMutations
  }), 200)
})

InventoryMutationController.openapi(InventoryMutationDetailRoute, async (context) => {
  const param = context.req.valid('param')
  const inventoryMutation = await InventoryMutationService.get(+param.id)

  return context.json(new ApiResponseData({
    code: 200,
    messages: [messages.successDetail('inventory mutation')],
    data: inventoryMutation
  }), 200)
})

InventoryMutationController.openapi(InventoryMutationCreateRoute, async (context) => {
  const payload = context.req.valid('json')

  const inventoryMutation = await InventoryMutationService.create(payload)

  return context.json(new ApiResponseData({
    code: 200,
    messages: [messages.successCreate(`Inventory mutation with ID ${inventoryMutation.id}`)],
    data: inventoryMutation
  }), 200)
})

InventoryMutationController.openapi(InventoryMutationUpdateRoute, async (context) => {
  const param = context.req.valid('param')
  const payload = context.req.valid('json')

  const inventoryMutation = await InventoryMutationService.update(+param.id, payload)

  return context.json(new ApiResponseData({
    code: 200,
    messages: [messages.successUpdate(`Inventory mutation with ID ${inventoryMutation.id}`)],
    data: inventoryMutation
  }), 200)
})

InventoryMutationController.openapi(InventoryMutationDeleteRoute, async (context) => {
  const param = context.req.valid('param')

  await InventoryMutationService.delete(+param.id)

  return context.json(new ApiResponse({
    code: 200,
    messages: [messages.successDelete(`Inventory mutation with ID ${param.id}`)],
  }), 200)
})

export default InventoryMutationController