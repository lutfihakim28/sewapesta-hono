import { honoApp } from '@/lib/utils/hono';
import { ProductCreateRoute, ProductDeleteRoute, ProductDetailRoute, ProductListRoute, ProductUpdateRoute } from './Product.route';
import { JwtPayload } from '@/lib/dtos/JwtPayload.dto';
import { checkPermissions } from '@/lib/utils/checkPermissions';
import { RoleEnum } from '@/lib/enums/RoleEnum';
import { ProductService } from './Product.service';
import { messages } from '@/lib/constants/messages';
import { ApiResponseData, ApiResponseList } from '@/lib/dtos/ApiResponse.dto';
import { Meta } from '@/lib/dtos/Meta.dto';
import { NotFoundException } from '@/lib/exceptions/NotFoundException';

const ProductController = honoApp()

ProductController.openapi(ProductListRoute, async (context) => {
  const query = context.req.valid('query')
  const [products, totalData] = await Promise.all([
    ProductService.list(query),
    ProductService.count(query),
  ])

  return context.json(new ApiResponseList({
    code: 200,
    messages: [messages.successList('product')],
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
    messages: [messages.successCreate('product')],
    data: product
  }), 200)
})

ProductController.openapi(ProductUpdateRoute, async (context) => {
  const param = context.req.valid('param')
  const payload = context.req.valid('json')
  const product = await ProductService.update(+param.id, payload)

  if (!product) {
    throw new NotFoundException(messages.errorNotFound(`Product with ID ${param.id}`))
  }

  return context.json(new ApiResponseData({
    code: 200,
    messages: [messages.successUpdate('product')],
    data: product
  }), 200)
})

ProductController.openapi(ProductDeleteRoute, async (context) => {
  const param = context.req.valid('param')
  const product = await ProductService.delete(+param.id)

  if (!product) {
    throw new NotFoundException(messages.errorNotFound(`Product with ID ${param.id}`))
  }

  return context.json(new ApiResponseData({
    code: 200,
    messages: [messages.successDelete('product')],
    data: product
  }), 200)
})

export default ProductController