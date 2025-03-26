import {
  ItemMutationCreateRoute, ItemMutationDeleteRoute,
  ItemMutationDetailRoute,
  ItemMutationListRoute, ItemMutationUpdateRoute,
} from '@/api/private/item-mutations/ItemMutation.route';
import { ItemMutationService } from '@/api/private/item-mutations/ItemMutation.service';
import { messages } from '@/lib/constants/messages';
import { ApiResponse, ApiResponseData, ApiResponseList } from '@/lib/dtos/ApiResponse.dto';
import { JwtPayload } from '@/lib/dtos/JwtPayload.dto';
import { Meta } from '@/lib/dtos/Meta.dto';
import { honoApp } from '@/lib/utils/hono';

const ItemMutationController = honoApp()

ItemMutationController.openapi(ItemMutationListRoute, async (context) => {
  const query = context.req.valid('query')
  const jwtPayload = new JwtPayload(context.get('jwtPayload'))

  const [mutations, totalData] = await ItemMutationService.list(query, jwtPayload.user)

  return context.json(new ApiResponseList({
    code: 200,
    messages: [messages.successList('Item Mutation')],
    data: mutations,
    meta: new Meta({
      page: query.page,
      pageSize: query.pageSize,
      total: totalData
    })
  }), 200)
})

ItemMutationController.openapi(ItemMutationDetailRoute, async (context) => {
  const param = context.req.valid('param')
  const jwtPayload = new JwtPayload(context.get('jwtPayload'))

  const item = await ItemMutationService.get(+param.id, jwtPayload.user)

  return context.json(new ApiResponseData({
    code: 200,
    messages: [messages.successDetail('Item Mutation')],
    data: item
  }), 200)
})

ItemMutationController.openapi(ItemMutationCreateRoute, async (context) => {
  const payload = context.req.valid('json')
  const jwtPayload = new JwtPayload(context.get('jwtPayload'))

  const item = await ItemMutationService.create(payload, jwtPayload.user)

  return context.json(new ApiResponseData({
    code: 200,
    messages: [messages.successCreate('Item Mutation')],
    data: item
  }), 200)
})

ItemMutationController.openapi(ItemMutationUpdateRoute, async (context) => {
  const param = context.req.valid('param')
  const payload = context.req.valid('json')
  const jwtPayload = new JwtPayload(context.get('jwtPayload'))

  const item = await ItemMutationService.update(+param.id, payload, jwtPayload.user)

  return context.json(new ApiResponseData({
    code: 200,
    messages: [messages.successUpdate(`Item Mutation with ID ${item.id}`)],
    data: item
  }), 200)
})

ItemMutationController.openapi(ItemMutationDeleteRoute, async (context) => {
  const param = context.req.valid('param')
  const jwtPayload = new JwtPayload(context.get('jwtPayload'))

  await ItemMutationService.delete(+param.id, jwtPayload.user)

  return context.json(new ApiResponse({
    code: 200,
    messages: [messages.successDelete(`Item Mutation with ID ${param.id}`)],
  }), 200)
})

export default ItemMutationController