import { honoApp } from '@/utils/helpers/hono';
import { ItemRevenueTermService } from './ItemRevenueTerm.service';
import { messages } from '@/utils/constants/messages';
import { ApiResponse, ApiResponseData, ApiResponseList } from '@/utils/dtos/ApiResponse.dto';
import { Meta } from '@/utils/dtos/Meta.dto';
import { ItemRevenueTermCreateRoute, ItemRevenueTermDeleteRoute, ItemRevenueTermDetailRoute, ItemRevenueTermListRoute, ItemRevenueTermUpdateRoute } from './ItemRevenueTerm.route';

const ItemRevenueTermController = honoApp()

ItemRevenueTermController.openapi(ItemRevenueTermListRoute, async (context) => {
  const query = context.req.valid('query')
  const [itemRevenueTerms, totalData] = await ItemRevenueTermService.list(query);

  return context.json(new ApiResponseList({
    code: 200,
    messages: [messages.successList('item revenue terms')],
    meta: new Meta({
      page: query.page!,
      pageSize: query.pageSize!,
      total: totalData
    }),
    data: itemRevenueTerms
  }), 200)
})

ItemRevenueTermController.openapi(ItemRevenueTermDetailRoute, async (context) => {
  const param = context.req.valid('param')
  const itemRevenueTerm = await ItemRevenueTermService.get(+param.id)

  return context.json(new ApiResponseData({
    code: 200,
    messages: [messages.successDetail('item revenue term')],
    data: itemRevenueTerm
  }), 200)
})

ItemRevenueTermController.openapi(ItemRevenueTermCreateRoute, async (context) => {
  const payload = context.req.valid('json')

  const itemRevenueTerm = await ItemRevenueTermService.create(payload)

  return context.json(new ApiResponseData({
    code: 200,
    messages: [messages.successCreate(`Item revenue term with ID ${itemRevenueTerm.id}`)],
    data: itemRevenueTerm
  }), 200)
})

ItemRevenueTermController.openapi(ItemRevenueTermUpdateRoute, async (context) => {
  const param = context.req.valid('param')
  const payload = context.req.valid('json')

  const itemRevenueTerm = await ItemRevenueTermService.update(+param.id, payload)

  return context.json(new ApiResponseData({
    code: 200,
    messages: [messages.successUpdate(`Item revenue term with ID ${itemRevenueTerm.id}`)],
    data: itemRevenueTerm
  }), 200)
})

ItemRevenueTermController.openapi(ItemRevenueTermDeleteRoute, async (context) => {
  const param = context.req.valid('param')

  await ItemRevenueTermService.delete(+param.id)

  return context.json(new ApiResponse({
    code: 200,
    messages: [messages.successDelete(`Item revenue term with ID ${param.id}`)],
  }), 200)
})

export default ItemRevenueTermController