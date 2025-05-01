import { honoApp } from '@/lib/utils/hono';
import { ItemOwnerCreateRoute, ItemOwnerDeleteRoute, ItemOwnerListRoute, ItemOwnerUpdateRoute } from './ItemOwner.route';
import { JwtPayload } from '@/lib/dtos/JwtPayload.dto';
import { ItemOwnerService } from './ItemOwner.service';
import { ApiResponseData, ApiResponseList } from '@/lib/dtos/ApiResponse.dto';
import { Meta } from '@/lib/dtos/Meta.dto';
import { messages } from '@/lib/constants/messages';

const ItemOwnerController = honoApp();

ItemOwnerController.openapi(ItemOwnerListRoute, async (context) => {
  const query = context.req.valid('query')
  const jwt = new JwtPayload(context.get('jwtPayload'))

  const [itemOwners, totalData] = await ItemOwnerService.list(query, jwt.user)

  return context.json(new ApiResponseList({
    code: 200,
    messages: [messages.successList('item owner')],
    meta: new Meta({
      total: totalData,
      page: query.page!,
      pageSize: query.pageSize,
    }),
    data: itemOwners,
  }), 200)
})

ItemOwnerController.openapi(ItemOwnerCreateRoute, async (context) => {
  const payload = context.req.valid('json')
  const jwt = new JwtPayload(context.get('jwtPayload'))

  const productItem = await ItemOwnerService.create(payload, jwt.user)

  return context.json(new ApiResponseData({
    code: 200,
    messages: [messages.successCreate(`Item owner`)],
    data: productItem
  }), 200)
})

ItemOwnerController.openapi(ItemOwnerUpdateRoute, async (context) => {
  const payload = context.req.valid('json')
  const param = context.req.valid('param')
  const jwt = new JwtPayload(context.get('jwtPayload'))

  const productItem = await ItemOwnerService.update(+param.id, payload, jwt.user)

  return context.json(new ApiResponseData({
    code: 200,
    messages: [messages.successUpdate(`Item owner`)],
    data: productItem
  }), 200)
})

ItemOwnerController.openapi(ItemOwnerDeleteRoute, async (context) => {
  const param = context.req.valid('param')
  const jwt = new JwtPayload(context.get('jwtPayload'))

  const productItem = await ItemOwnerService.delete(+param.id)

  return context.json(new ApiResponseData({
    code: 200,
    messages: [messages.successDelete(`Item owner`)],
    data: productItem
  }), 200)
})

export default ItemOwnerController;