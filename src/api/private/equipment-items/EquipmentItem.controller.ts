import { honoApp } from '@/lib/utils/hono';
import { EquipmentItemCreateRoute, EquipmentItemDeleteRoute, EquipmentItemDetailRoute, EquipmentItemListRoute, EquipmentItemUpdateRoute } from './EquipmentItem.route';
import { EquipmentItemService } from './EquipmentItem.service';
import { ApiResponse, ApiResponseData, ApiResponseList } from '@/lib/dtos/ApiResponse.dto';
import { messages } from '@/lib/constants/messages';
import { Meta } from '@/lib/dtos/Meta.dto';

const EquipmentItemController = honoApp()

EquipmentItemController.openapi(EquipmentItemListRoute, async (context) => {
  const query = context.req.valid('query')
  const [items, totalData] = await EquipmentItemService.list(query);

  return context.json(new ApiResponseList({
    code: 200,
    messages: [messages.successList('equipment items')],
    meta: new Meta({
      page: query.page,
      pageSize: query.pageSize,
      total: totalData
    }),
    data: items
  }), 200)
})

EquipmentItemController.openapi(EquipmentItemDetailRoute, async (context) => {
  const param = context.req.valid('param')

  const item = await EquipmentItemService.get(+param.id)

  return context.json(new ApiResponseData({
    code: 200,
    messages: [messages.successDetail('equipment item')],
    data: item,
  }), 200)
})

EquipmentItemController.openapi(EquipmentItemCreateRoute, async (context) => {
  const payload = context.req.valid('json')

  const item = await EquipmentItemService.create(payload)

  return context.json(new ApiResponseData({
    code: 200,
    messages: [messages.successCreate(`Equipment item ${item.number}`)],
    data: item,
  }), 200)
})

EquipmentItemController.openapi(EquipmentItemUpdateRoute, async (context) => {
  const param = context.req.valid('param')
  const payload = context.req.valid('json')

  const item = await EquipmentItemService.update(+param.id, payload)

  return context.json(new ApiResponseData({
    code: 200,
    messages: [messages.successUpdate(`Equipment item with ID ${param.id}`)],
    data: item,
  }), 200)
})

EquipmentItemController.openapi(EquipmentItemDeleteRoute, async (context) => {
  const param = context.req.valid('param')

  await EquipmentItemService.delete(+param.id)

  return context.json(new ApiResponse({
    code: 200,
    messages: [messages.successDelete(`Equipment item with ID ${param.id}`)]
  }), 200)
})

export default EquipmentItemController;