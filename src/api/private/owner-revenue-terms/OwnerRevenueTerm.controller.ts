import { honoApp } from '@/utils/helpers/hono';
import { OwnerRevenueTermService } from './OwnerRevenueTerm.service';
import { messages } from '@/utils/constants/locales/messages';
import { ApiResponse, ApiResponseData, ApiResponseList } from '@/utils/dtos/ApiResponse.dto';
import { Meta } from '@/utils/dtos/Meta.dto';
import { OwnerRevenueTermCreateRoute, OwnerRevenueTermDeleteRoute, OwnerRevenueTermDetailRoute, OwnerRevenueTermListRoute, OwnerRevenueTermUpdateRoute } from './OwnerRevenueTerm.route';

const OwnerRevenueTermController = honoApp()

OwnerRevenueTermController.openapi(OwnerRevenueTermListRoute, async (context) => {
  const query = context.req.valid('query')
  const [ownerRevenueTerms, totalData] = await OwnerRevenueTermService.list(query);

  return context.json(new ApiResponseList({
    code: 200,
    messages: [messages.successList('owner revenue terms')],
    meta: new Meta({
      page: query.page!,
      pageSize: query.pageSize!,
      total: totalData
    }),
    data: ownerRevenueTerms
  }), 200)
})

OwnerRevenueTermController.openapi(OwnerRevenueTermDetailRoute, async (context) => {
  const param = context.req.valid('param')
  const ownerRevenueTerm = await OwnerRevenueTermService.get(+param.id)

  return context.json(new ApiResponseData({
    code: 200,
    messages: [messages.successDetail('owner revenue term')],
    data: ownerRevenueTerm
  }), 200)
})

OwnerRevenueTermController.openapi(OwnerRevenueTermCreateRoute, async (context) => {
  const payload = context.req.valid('json')

  const ownerRevenueTerm = await OwnerRevenueTermService.create(payload)

  return context.json(new ApiResponseData({
    code: 200,
    messages: [messages.successCreate(`Owner revenue term with ID ${ownerRevenueTerm.id}`)],
    data: ownerRevenueTerm
  }), 200)
})

OwnerRevenueTermController.openapi(OwnerRevenueTermUpdateRoute, async (context) => {
  const param = context.req.valid('param')
  const payload = context.req.valid('json')

  const ownerRevenueTerm = await OwnerRevenueTermService.update(+param.id, payload)

  return context.json(new ApiResponseData({
    code: 200,
    messages: [messages.successUpdate(`Owner revenue term with ID ${ownerRevenueTerm.id}`)],
    data: ownerRevenueTerm
  }), 200)
})

OwnerRevenueTermController.openapi(OwnerRevenueTermDeleteRoute, async (context) => {
  const param = context.req.valid('param')

  await OwnerRevenueTermService.delete(+param.id)

  return context.json(new ApiResponse({
    code: 200,
    messages: [messages.successDelete(`Owner revenue term with ID ${param.id}`)],
  }), 200)
})

export default OwnerRevenueTermController