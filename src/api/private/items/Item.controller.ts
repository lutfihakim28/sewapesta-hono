import { honoApp } from '@/utils/helpers/hono';
import { ItemCreateRoute, ItemDeleteRoute, ItemDetailRoute, ItemListRoute, ItemUpdateRoute } from 'src/api/private/items/Item.route';
import { ItemService } from './Item.service';
import { JwtPayload } from '@/utils/dtos/JwtPayload.dto';
import { ApiResponse, ApiResponseData, ApiResponseList } from '@/utils/dtos/ApiResponse.dto';
import { Meta } from '@/utils/dtos/Meta.dto';
import { messages } from '@/utils/constants/locales/messages';

const ItemController = honoApp()

ItemController.openapi(ItemListRoute, async (context) => {
  const query = context.req.valid('query')
  const [items, totalData] = await ItemService.list(query);

  return context.json(new ApiResponseList({
    code: 200,
    messages: [messages.successList('items')],
    meta: new Meta({
      page: query.page,
      pageSize: query.pageSize,
      total: totalData
    }),
    data: items
  }), 200)
})

ItemController.openapi(ItemDetailRoute, async (context) => {
  const param = context.req.valid('param')

  const item = await ItemService.get(+param.id)

  return context.json(new ApiResponseData({
    code: 200,
    messages: [messages.successDetail('item')],
    data: item,
  }), 200)
})

ItemController.openapi(ItemCreateRoute, async (context) => {
  const payload = context.req.valid('json')

  const item = await ItemService.create(payload)

  return context.json(new ApiResponseData({
    code: 200,
    messages: [messages.successCreate(`Item ${payload.name}`)],
    data: item,
  }), 200)
})

ItemController.openapi(ItemUpdateRoute, async (context) => {
  const param = context.req.valid('param')
  const payload = context.req.valid('json')
  const jwtPayload = new JwtPayload(context.get('jwtPayload'))

  const item = await ItemService.update(+param.id, payload)

  return context.json(new ApiResponseData({
    code: 200,
    messages: [messages.successUpdate(`Item with ID ${param.id}`)],
    data: item,
  }), 200)
})

ItemController.openapi(ItemDeleteRoute, async (context) => {
  const param = context.req.valid('param')

  await ItemService.delete(+param.id)

  return context.json(new ApiResponse({
    code: 200,
    messages: [messages.successDelete(`Item with ID ${param.id}`)]
  }), 200)
})

export default ItemController;