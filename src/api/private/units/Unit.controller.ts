import { honoApp } from '@/utils/helpers/hono';
import { UnitCheckRoute, UnitCreateRoute, UnitDeleteRoute, UnitListRoute, UnitUpdateRoute } from 'src/api/private/units/Unit.route';
import { UnitService } from './Unit.service';
import { ApiResponse, ApiResponseList } from '@/utils/dtos/ApiResponse.dto';
import { messages } from '@/utils/constants/messages';
import { Meta } from '@/utils/dtos/Meta.dto';

const UnitController = honoApp()

UnitController.openapi(UnitListRoute, async (context) => {
  const query = context.req.valid('query')

  const [units, totalData] = await UnitService.list(query)

  return context.json(new ApiResponseList({
    code: 200,
    messages: [messages.successList('unit')],
    meta: new Meta({
      page: query.page!,
      pageSize: query.pageSize!,
      total: totalData
    }),
    data: units
  }), 200)
})

UnitController.openapi(UnitCreateRoute, async (context) => {
  const payload = context.req.valid('json');

  await UnitService.create(payload)

  return context.json(new ApiResponse({
    code: 200,
    messages: [messages.successCreate(`Unit with name ${payload.name}`)],
  }), 200)
})

UnitController.openapi(UnitUpdateRoute, async (context) => {
  const param = context.req.valid('param')
  const payload = context.req.valid('json')

  await UnitService.update(+param.id, payload);

  return context.json(new ApiResponse({
    code: 200,
    messages: [messages.successUpdate(`Unit with ID ${param.id}`)],
  }), 200)
})

UnitController.openapi(UnitDeleteRoute, async (context) => {
  const param = context.req.valid('param')

  await UnitService.delete(+param.id)

  return context.json(new ApiResponse({
    code: 200,
    messages: [messages.successDelete(`Unit with ID ${param.id}`)]
  }), 200)
})

UnitController.openapi(UnitCheckRoute, async (context) => {
  const query = context.req.valid('query')

  await UnitService.checkAvailability(query)

  return context.json(new ApiResponse({
    code: 200,
    messages: ['Unit\'s name is available.']
  }), 200)
})

export default UnitController