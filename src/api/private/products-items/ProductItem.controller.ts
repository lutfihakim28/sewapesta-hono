import { honoApp } from '@/lib/utils/hono';
import { ProductItemCreateRoute, ProductItemDeleteRoute, ProductItemListRoute, ProductItemUpdateRoute } from './ProductItem.route';
import { JwtPayload } from '@/lib/dtos/JwtPayload.dto';
import { ProductItemService } from './ProductItem.service';
import { ApiResponseData, ApiResponseList } from '@/lib/dtos/ApiResponse.dto';
import { Meta } from '@/lib/dtos/Meta.dto';
import { messages } from '@/lib/constants/messages';

const ProductItemController = honoApp();

ProductItemController.openapi(ProductItemListRoute, async (context) => {
  const query = context.req.valid('query')
  const [productsItems, totalData] = await ProductItemService.list(query)

  return context.json(new ApiResponseList({
    code: 200,
    messages: [messages.successList('product item')],
    meta: new Meta({
      total: totalData,
      page: query.page!,
      pageSize: query.pageSize,
    }),
    data: productsItems,
  }), 200)
})

ProductItemController.openapi(ProductItemCreateRoute, async (context) => {
  const payload = context.req.valid('json')
  const jwt = new JwtPayload(context.get('jwtPayload'))

  const productItem = await ProductItemService.create(payload, jwt.user)

  return context.json(new ApiResponseData({
    code: 200,
    messages: [messages.successCreate(`Product item`)],
    data: productItem
  }), 200)
})

ProductItemController.openapi(ProductItemUpdateRoute, async (context) => {
  const payload = context.req.valid('json')
  const jwt = new JwtPayload(context.get('jwtPayload'))

  const productItem = await ProductItemService.update(payload, jwt.user)

  return context.json(new ApiResponseData({
    code: 200,
    messages: [messages.successUpdate(`Product item`)],
    data: productItem
  }), 200)
})

ProductItemController.openapi(ProductItemDeleteRoute, async (context) => {
  const param = context.req.valid('param')
  const jwt = new JwtPayload(context.get('jwtPayload'))

  const productItem = await ProductItemService.delete(+param.itemId, +param.productId, jwt.user)

  return context.json(new ApiResponseData({
    code: 200,
    messages: [messages.successDelete(`Product item`)],
    data: productItem
  }), 200)
})

export default ProductItemController;