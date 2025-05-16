import { honoApp } from '@/utils/helpers/hono';
import { ProductCreateRoute, ProductDeleteRoute, ProductDetailRoute, ProductListRoute, ProductUpdateRoute } from 'src/api/private/products/Product.route';
import { ProductService } from './Product.service';
import { messages } from '@/utils/constants/messages';
import { ApiResponse, ApiResponseData, ApiResponseList } from '@/utils/dtos/ApiResponse.dto';
import { Meta } from '@/utils/dtos/Meta.dto';

const ProductController = honoApp()

ProductController.openapi(ProductListRoute, async (context) => {
  const query = context.req.valid('query')
  const [products, totalData] = await ProductService.list(query);

  return context.json(new ApiResponseList({
    code: 200,
    messages: [messages.successList('products')],
    meta: new Meta({
      page: query.page!,
      pageSize: query.pageSize!,
      total: totalData
    }),
    data: products
  }), 200)
})

ProductController.openapi(ProductDetailRoute, async (context) => {
  const param = context.req.valid('param')
  const product = await ProductService.get(+param.id)

  return context.json(new ApiResponseData({
    code: 200,
    messages: [messages.successDetail('product')],
    data: product
  }), 200)
})

ProductController.openapi(ProductCreateRoute, async (context) => {
  const payload = context.req.valid('json')

  const product = await ProductService.create(payload)

  return context.json(new ApiResponseData({
    code: 200,
    messages: [messages.successCreate(`Product with name ${product.name}`)],
    data: product
  }), 200)
})

ProductController.openapi(ProductUpdateRoute, async (context) => {
  const param = context.req.valid('param')
  const payload = context.req.valid('json')

  const product = await ProductService.update(+param.id, payload)

  return context.json(new ApiResponseData({
    code: 200,
    messages: [messages.successUpdate(`Product with ID ${product.id}`)],
    data: product
  }), 200)
})

ProductController.openapi(ProductDeleteRoute, async (context) => {
  const param = context.req.valid('param')

  await ProductService.delete(+param.id)

  return context.json(new ApiResponse({
    code: 200,
    messages: [messages.successDelete(`Product with ID ${param.id}`)],
  }), 200)
})

export default ProductController