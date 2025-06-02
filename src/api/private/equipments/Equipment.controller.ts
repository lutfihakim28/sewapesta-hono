import { honoApp } from '@/utils/helpers/hono';
import { EquipmentCreateRoute, EquipmentDeleteRoute, EquipmentDetailRoute, EquipmentListRoute, EquipmentUpdateRoute } from './Equipment.route';
import { ApiResponse, ApiResponseData, ApiResponseList } from '@/utils/dtos/ApiResponse.dto';
import { messages } from '@/utils/constants/locales/messages';
import { Meta } from '@/utils/dtos/Meta.dto';
import { EquipmentService } from './Equipment.service';

const EquipmentController = honoApp()

EquipmentController.openapi(EquipmentListRoute, async (context) => {
  const query = context.req.valid('query')
  const [items, totalData] = await EquipmentService.list(query);

  return context.json(new ApiResponseList({
    code: 200,
    messages: [messages.successList('equipments')],
    meta: new Meta({
      page: query.page,
      pageSize: query.pageSize,
      total: totalData
    }),
    data: items
  }), 200)
})

EquipmentController.openapi(EquipmentDetailRoute, async (context) => {
  const param = context.req.valid('param')

  const item = await EquipmentService.get(+param.id)

  return context.json(new ApiResponseData({
    code: 200,
    messages: [messages.successDetail('equipment')],
    data: item,
  }), 200)
})

EquipmentController.openapi(EquipmentCreateRoute, async (context) => {
  const payload = context.req.valid('json')

  const item = await EquipmentService.create(payload)

  return context.json(new ApiResponseData({
    code: 200,
    messages: [messages.successCreate(`Equipment ${item.number}`)],
    data: item,
  }), 200)
})

EquipmentController.openapi(EquipmentUpdateRoute, async (context) => {
  const param = context.req.valid('param')
  const payload = context.req.valid('json')

  const item = await EquipmentService.update(+param.id, payload)

  return context.json(new ApiResponseData({
    code: 200,
    messages: [messages.successUpdate(`Equipment with ID ${param.id}`)],
    data: item,
  }), 200)
})

EquipmentController.openapi(EquipmentDeleteRoute, async (context) => {
  const param = context.req.valid('param')

  await EquipmentService.delete(+param.id)

  return context.json(new ApiResponse({
    code: 200,
    messages: [messages.successDelete(`Equipment with ID ${param.id}`)]
  }), 200)
})

export default EquipmentController;